"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { generateCustomUID } from "../../../lib/firebase";

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
            alert("This phone number is already registered.");
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
          alert(responseData.message);
          setUserId(responseData.userId);
          setIsUserIdVisible(true);
          setIsOtpSent(false);
          setOtp("");
          setFormData({
            name: "",
            contactNo: "",
            peeta: "",
            karthruGuru: "",
          });
        } else {
          alert(responseData.error || "Signup failed. Please try again.");
        }
      } else {
        alert(`OTP verification failed: ${response.data.Details}`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during OTP verification.");
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
        const uniquePeeta = [...new Set(response.data)] as string[];
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
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => changeLanguage("hi")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            हिंदी
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
                      alert("Phone number must be exactly 10 digits.");
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
                {t("signupl2.karthruGuru")}:
                <input
                  type="text"
                  name="karthruGuru"
                  value={formData.karthruGuru}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>

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
    
    </>
  );
}
