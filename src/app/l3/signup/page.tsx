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
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN3/SVD`
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
          setUserId(responseData.userId);
          setIsUserIdVisible(true);
          alert(`Signup successful! Your User ID is: ${responseData.userId}`);
          router.push("/l3/login");
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

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-100 min-h-screen py-6 sm:py-10">
      <div className="flex flex-col items-center p-6 bg-gray-100 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Select Your Language
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            English
          </button>
          <button
            onClick={() => i18n.changeLanguage("kn")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => i18n.changeLanguage("hi")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            हिंदी
          </button>
        </div>
      </div>

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
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
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
          <a href="/l3/login" className="text-blue-500 hover:text-blue-700 font-medium">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
