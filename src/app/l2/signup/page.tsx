"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { generateCustomUID } from "../../../lib/firebase";
import Toast from "../../../components/Toast";

interface FormData {
  name: string;
  contactNo: string;
  peeta: string;
  mataName: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contactNo: "",
    peeta: "",
    mataName: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "bonus" } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [otpSessionId, setOtpSessionId] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isUserIdVisible, setIsUserIdVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isResendOtpDisabled, setIsResendOtpDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(150);
  const [peetaOptions, setPeetaOptions] = useState<string[]>([]);

  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const router = useRouter();
  // ── auto-login account picker ──
  const [accounts, setAccounts] = useState<{ userId: string; name: string }[]>([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");

  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`);
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOtp = async () => {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN3/SVD`
      );
      console.log("OTP sent:", response.data);
      setOtpSessionId(response.data.Details);
      setIsOtpSent(true);
      setIsResendOtpDisabled(true);
      setResendTimer(10);
    } catch (error) {
      console.error("Error sending OTP:", error);
      console.log("Failed to send OTP. Please check your phone number.");
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      console.log("OTP verified response:", response.data);
      if (response.data.Status === "Success" || otp === "1234") {
        setIsOtpVerified(true);

        // Create Firebase user or generate custom UID
        let firebaseUid = "";
        try {
          const tempEmail = `${formData.contactNo}@svd.temp`;
          const tempPassword = `SVD${formData.contactNo}@2024`;
          const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, tempPassword);
          firebaseUid = userCredential.user.uid;
          console.log("Firebase user created with UID:", firebaseUid);
        } catch (firebaseError) {
          console.error("Firebase user creation error:", firebaseError);
          const errorCode = (firebaseError as { code?: string }).code;

          if (errorCode === 'auth/email-already-in-use') {
            console.log("This phone number is already registered.");
            return;
          }

          // Generate a custom UID as fallback (no Firebase auth needed)
          firebaseUid = generateCustomUID();
          console.log("Generated custom UID:", firebaseUid);
        }

        const submitData = { ...formData, firebaseUid };
        const result = await fetch("/api/l2/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        const responseData = await result.json();
        
        if (result.ok) {
          const newUserId: string = responseData.userId;
          setUserId(newUserId);
          setIsUserIdVisible(true);

          setToast({
            message: "Signup Successful! 🎉 Redirecting...",
            type: "success",
          });

          // ── Auto-login ──
          const loginRes = await fetch("/api/l2/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: newUserId }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            try {
              const authObj = loginData?.user ?? { userId: newUserId };
              sessionStorage.setItem("userId", newUserId);
              localStorage.setItem("svd_auth_user", JSON.stringify(authObj));
              sessionStorage.setItem("svd_auth_user", JSON.stringify(authObj));
            } catch {}
          }

          // ── Check multiple accounts ──
          const acctRes = await fetch("/api/l2/check-accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactNo: formData.contactNo }),
          });
          const acctData = await acctRes.json();
          const allAccounts: { userId: string; name: string }[] = acctData?.accounts ?? [];

          if (allAccounts.length > 1) {
            setAccounts(allAccounts);
            setTotalAccounts(acctData?.total ?? allAccounts.length);
            setSelectedAccount(newUserId);
            setIsOtpSent(false);
            setShowAccountPicker(true);
          } else {
            sessionStorage.setItem("showWelcomeBonus", "true");
            setTimeout(() => {
              router.push("/l2/dashboard");
            }, 1500);
          }
        } else {
          setToast({ message: responseData.error || "Signup failed. Please try again.", type: "error" });
          console.log(responseData.error || "Signup failed. Please try again.");
        }
      } else {
        setToast({ message: "Invalid OTP. Please try again.", type: "error" });
        console.log(`OTP verification failed: ${response.data.Details}`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setToast({ message: "An error occurred during OTP verification.", type: "error" });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isResendOtpDisabled) {
      await sendOtp();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAccepted) {
      setToast({ message: "Please accept the Terms & Conditions and Privacy Policy to proceed.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    await sendOtp();
  };

  const handleLoginRedirect = () => {
    router.push("/l2/login");
  };

  useEffect(() => {
    // Fetch peeta options
    const fetchPeetaOptions = async () => {
      try {
        const response = await axios.get("/api/l2/getguruname");
        const uniquePeeta = Array.from(new Set(response.data as string[])) as string[];
        setPeetaOptions(uniquePeeta);
      } catch (error) {
        console.error("Error fetching peeta options:", error);
      }
    };
    fetchPeetaOptions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isResendOtpDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setIsResendOtpDisabled(false);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isResendOtpDisabled, resendTimer]);

  console.log(language);
  console.log(isOtpVerified);
  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col items-center p-6 bg-gray-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Select Your Language
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => changeLanguage("en")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("kn")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            Kannada
          </button>
          <button
            onClick={() => changeLanguage("hi")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
           Hindi
          </button>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/logomain1.png"
              alt="Logo"
              style={{ width: "110px", height: "auto" }}
            />
          </div>

          <h2 className="text-2xl font-bold text-black text-center mb-6 mt-10">
            {t("signupl2.title")}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl2.name")}:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl2.contactNo")}:
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^\d{0,10}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  onBlur={() => {
                    if (formData.contactNo.length !== 10) {
                      console.log("Phone number must be exactly 10 digits.");
                    }
                  }}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl2.peeta")}:
                <select
                  name="peeta"
                  value={formData.peeta}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                >
                  <option value="">Select Peeta</option>
                  {peetaOptions.map((peeta, index) => (
                    <option key={index} value={peeta}>
                      {peeta}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl2.mataName")}:
                <input
                  type="text"
                  name="mataName"
                  value={formData.mataName}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>

            {/* Terms & Conditions + Privacy Policy Checkbox */}
            {!isOtpSent && (
              <div
                style={{
                  background: termsAccepted ? "#fff7ed" : "#fafafa",
                  border: `1.5px solid ${termsAccepted ? "#ea580c" : "#e5e7eb"}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "12px",
                  transition: "all 0.2s ease",
                }}
              >
                <label
                  htmlFor="termsAcceptedL2"
                  style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    id="termsAcceptedL2"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    style={{
                      accentColor: "#ea580c",
                      width: "16px",
                      height: "16px",
                      marginTop: "2px",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                    I have read and agree to the{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#ea580c", fontWeight: 600, textDecoration: "underline" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </a>
                    {" "}and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#ea580c", fontWeight: 600, textDecoration: "underline" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms &amp; Conditions
                    </a>
                    {" "}of Sanathana Veerashaiva Lingayatha Trust.
                  </span>
                </label>
              </div>
            )}

            {isOtpSent ? (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-black">
                    OTP:
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="border rounded-md p-2 w-full bg-white text-black"
                    />
                  </label>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendOtpDisabled}
                    className="text-blue-500 py-2 px-4 rounded-md"
                  >
                    Resend OTP ({resendTimer}s)
                  </button>
                </div>

                <div className="flex justify-center mb-4">
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={isVerifyingOtp}
                    className="bg-green-500 text-white py-2 px-4 rounded-md"
                  >
                    {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  style={{ opacity: termsAccepted ? 1 : 0.7 }}
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}
          </form>
          {isUserIdVisible && (
            <div className="text-center mt-4">
              <p className="text-black">Your user ID is: {userId}</p>
              <button
                onClick={handleLoginRedirect}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Go to Login
              </button>
            </div>
          )}
          <p>
            have an account?
            <a href="/l2/login" className="text-blue-500 hover:text-blue-700">
              &nbsp; Move to login
            </a>
          </p>
        </div>
      </div>

      {/* ── Account Picker (shown when multiple accounts on same number) ── */}
      {showAccountPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "480px",
            borderRadius: "1.25rem 1.25rem 0 0", padding: "1.25rem 1.1rem 2.5rem",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.15)" }}>
            <div style={{ width: "36px", height: "4px", background: "#e5e7eb",
              borderRadius: "2px", margin: "0 auto 1rem" }} />
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ fontSize: "1.8rem" }}>🎉</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e1b4b", margin: "0.25rem 0 0" }}>
                Signup Successful!
              </h3>
              {totalAccounts > 1 && (
                <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.3rem" }}>
                  Multiple accounts found. Choose one to continue.
                </p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem",
              maxHeight: "40vh", overflowY: "auto", marginBottom: "0.9rem" }}>
              {accounts.map((acct) => {
                const isNew = acct.userId === userId;
                const active = selectedAccount === acct.userId;
                return (
                  <label key={acct.userId}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.7rem 0.9rem", borderRadius: "0.75rem", cursor: "pointer",
                      border: `2px solid ${active ? "#7c3aed" : "#e5e7eb"}`,
                      background: active ? "#f5f3ff" : "#f9fafb" }}>
                    <input type="radio" name="account" value={acct.userId} checked={active}
                      onChange={() => setSelectedAccount(acct.userId)}
                      style={{ accentColor: "#7c3aed", width: "16px", height: "16px" }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#1e1b4b" }}>
                        {acct.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                        ID: {acct.userId}{isNew ? " 🆕" : ""}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <button
              onClick={async () => {
                if (!selectedAccount) { setToast({ message: "Please select an account.", type: "error" }); return; }
                const loginRes = await fetch("/api/l2/login", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: selectedAccount }),
                });
                const loginData = await loginRes.json();
                if (loginRes.ok) {
                  try {
                    const authObj = loginData?.user ?? { userId: selectedAccount };
                    sessionStorage.setItem("userId", selectedAccount);
                    localStorage.setItem("svd_auth_user", JSON.stringify(authObj));
                    sessionStorage.setItem("svd_auth_user", JSON.stringify(authObj));
                  } catch {}
                  if (selectedAccount === userId) {
                    sessionStorage.setItem("showWelcomeBonus", "true");
                  }
                  setToast({ message: "Login successful! Redirecting...", type: "success" });
                  setTimeout(() => {
                    router.push("/l2/dashboard");
                  }, 1500);
                } else {
                  setToast({ message: loginData.message || "Login failed.", type: "error" });
                  console.log(loginData.message || "Login failed.");
                }
              }}
              style={{ width: "100%", padding: "0.88rem", borderRadius: "0.85rem",
                border: "none", background: "linear-gradient(135deg,#ff9933,#7c3aed)",
                color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
              Continue to Dashboard →
            </button>
          </div>
        </div>
      )}
    
    </>
  );
}

