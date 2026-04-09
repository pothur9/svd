"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { generateCustomUID } from "../../../lib/firebase";
import Image from "next/image";

interface FormData {
  name: string;
  contactNo: string;
  peeta: string;
  karthruGuru: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contactNo: "",
    peeta: "",
    karthruGuru: "",
  });
  const [otp, setOtp] = useState<string>("");
  const [otpSessionId, setOtpSessionId] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  // removed unused isOtpVerified state to satisfy linter
  const [userId, setUserId] = useState<string>("");
  const [isUserIdVisible, setIsUserIdVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [peetaOptions, setPeetaOptions] = useState<string[]>([]);
  const [l2Users, setL2Users] = useState<string[]>([]);

  const [accounts, setAccounts] = useState<{ userId: string; name: string }[]>([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("en");

  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // Fetch peeta options for dropdown
    const fetchPeetaOptions = async () => {
      try {
        const response = await fetch("/api/l1/dashboard");
        if (response.ok) {
          const data = await response.json();
          const peetas = (data as Array<{ l1User: { peeta: string } }>).map((item) => item.l1User.peeta);
          setPeetaOptions(peetas);
        }
      } catch (error) {
        console.error("Error fetching peeta options:", error);
      }
    };
    fetchPeetaOptions();

    // Fetch L2 users for guru dropdown
    const fetchL2Users = async () => {
      try {
        const res = await fetch("/api/l3/findl2users", { cache: "no-store" });
        if (res.ok) {
          const users = await res.json();
          const names = (users as Array<{ name: string }>).map(u => u.name).filter(Boolean);
          setL2Users(names);
        }
      } catch (err) {
        console.error("Error fetching L2 users:", err);
      }
    };
    fetchL2Users();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOtp = async () => {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN2/SVD`
      );
      console.log("OTP sent:", response.data);
      setOtpSessionId(response.data.Details);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check your phone number.");
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
      if (response.data.Status === "Success") {

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
            alert("This phone number is already registered.");
            return;
          }

          // Generate a custom UID as fallback (no Firebase auth needed)
          firebaseUid = generateCustomUID();
          console.log("Generated custom UID:", firebaseUid);
        }

        const submitData = { ...formData, firebaseUid };
        const result = await fetch("/api/l3/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        const responseData = await result.json();

        if (result.ok) {
          const newUserId: string = responseData.userId;
          setUserId(newUserId);
          setIsUserIdVisible(true);

          // ── Auto-login ──
          const loginRes = await fetch("/api/l3/login", {
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
          const acctRes = await fetch("/api/l3/check-accounts", {
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
            setShowAccountPicker(true);
          } else {
            router.push("/l3/dashboard");
          }
        } else {
          alert(responseData.message || "Signup failed");
        }
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during verification.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.contactNo || !formData.peeta || !formData.karthruGuru) {
      alert("Please fill in all fields.");
      return;
    }
    if (!/^\d{10}$/.test(formData.contactNo)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsSubmitting(true);
    await sendOtp();
    setIsSubmitting(false);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setActiveLanguage(lang);
  };

  return (
    <>
      {/* ── Language Switcher Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
          padding: "18px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 4px 20px rgba(194,65,12,0.35)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Choose Language / ಭಾಷೆ ಆಯ್ಕೆ / भाषा चुनें
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "rgba(0,0,0,0.2)",
            padding: "4px",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {[
            { code: "en", flag: "🇬🇧", label: "English", native: "English" },
            { code: "kn", flag: "🇮🇳", label: "Kannada", native: "ಕನ್ನಡ" },
            { code: "hi", flag: "🇮🇳", label: "Hindi",   native: "हिंदी" },
          ].map(({ code, flag, label, native }) => {
            const isActive = activeLanguage === code;
            return (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                title={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "14px",
                  transition: "all 0.25s ease",
                  background: isActive
                    ? "linear-gradient(135deg, #ffffff, #fed7aa)"
                    : "transparent",
                  color: isActive ? "#c2410c" : "rgba(255,255,255,0.75)",
                  boxShadow: isActive
                    ? "0 3px 12px rgba(0,0,0,0.25)"
                    : "none",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)";
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "15px" }}>{flag}</span>
                <span>{native}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-b from-slate-50 to-orange-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl text-gray-800">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          {t("signupl3.title")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1">
              {t("signupl1.name")}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="contactNo" className="block text-sm font-semibold mb-1">
              {t("signupl1.contactNo")}
            </label>
            <input
              type="text"
              name="contactNo"
              id="contactNo"
              value={formData.contactNo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormData({ ...formData, contactNo: value });
              }}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Enter your 10-digit phone number"
              maxLength={10}
              required
            />
          </div>

          <div>
            <label htmlFor="peeta" className="block text-sm font-semibold mb-1">
              {t("signupl3.peeta")}
            </label>
            <select
              name="peeta"
              id="peeta"
              value={formData.peeta}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
              required
            >
              <option value="">Select Peeta</option>
              {peetaOptions.map((peeta, index) => (
                <option key={index} value={peeta}>
                  {peeta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="karthruGuru" className="block text-sm font-semibold mb-1">
              {t("signupl3.karthruGuru")}
            </label>
            <select
              name="karthruGuru"
              id="karthruGuru"
              value={formData.karthruGuru}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
              required
            >
              <option value="">Select Guru</option>
              {l2Users.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {!isOtpSent ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-3 rounded-md text-white font-semibold ${
                isSubmitting
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {isSubmitting ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                  placeholder="Enter OTP"
                  required
                />
              </div>

              <button
                type="button"
                onClick={verifyOtp}
                disabled={isVerifyingOtp}
                className={`w-full p-3 rounded-md text-white font-semibold ${
                  isVerifyingOtp
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP & Signup"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                  setOtpSessionId("");
                }}
                className="w-full p-3 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Resend OTP
              </button>
            </div>
          )}

          {isUserIdVisible && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
              <p className="text-green-800 font-semibold">
                Signup successful! Your User ID: <span className="font-mono">{userId}</span>
              </p>
              <p className="text-green-700 text-sm mt-1">
                Please save this User ID for future login.
              </p>
            </div>
          )}
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-700">Already have an account? </span>
          <a href="/l3/login" className="text-orange-600 hover:text-orange-800 font-medium">
            Login here
          </a>
        </div>
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
                if (!selectedAccount) { alert("Please select an account."); return; }
                const loginRes = await fetch("/api/l3/login", {
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
                  router.push("/l3/dashboard");
                } else {
                  alert(loginData.message || "Login failed.");
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

export const dynamic = "force-dynamic";

