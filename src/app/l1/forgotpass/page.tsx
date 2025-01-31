"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPasswordPage: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const sendOtp = async () => {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${contactNo}/AUTOGEN/SVD`
      );
      setOtpSessionId(response.data.Details);
      setIsOtpSent(true);
      setResendTimer(30);
      setMessage("OTP sent successfully!");
    } catch (error) {
      setMessage("Failed to send OTP. Please check your phone number.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      if (response.data.Status === "Success") {
        setIsOtpVerified(true);
        setMessage("OTP verified successfully.");
      } else {
        setMessage("OTP verification failed.");
      }
    } catch (error) {
      setMessage("Error verifying OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setMessage("Please verify the OTP first.");
      return;
    }

    try {
      const response = await fetch("/api/l1/forgotpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, contactNo, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => router.push("/l1/login"), 4000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Forgot Password
        </h2>
        {message && <p className="text-center text-green-400 mb-4">{message}</p>}
        <label className="block mb-4">
          <span className="text-gray-700">User ID</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Contact Number</span>
          <input
            type="text"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            placeholder="Enter your contact number"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
          />
        </label>
        {isOtpSent && (
          <label className="block mb-4">
            <span className="text-gray-700">OTP</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={!otp}
              className="w-full p-2 mt-2 bg-green-500 text-white hover:bg-green-600 rounded-md"
            >
              Verify OTP
            </button>
          </label>
        )}
        {!isOtpSent && (
          <button
            type="button"
            onClick={sendOtp}
            disabled={resendTimer > 0}
            className="w-full p-2 mb-4 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Send OTP"}
          </button>
        )}
        {isOtpVerified && (
          <label className="block mb-4">
            <span className="text-gray-700">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={!isOtpVerified || !newPassword}
          className={`w-full p-2 rounded-md ${
            isOtpVerified
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
