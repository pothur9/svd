"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


const LoginPage = () => {
  const [userId, setUserId] = useState<string>(""); // Type for userId
  const [contactNo, setContactNo] = useState<string>(""); // Type for contact number
  const [otp, setOtp] = useState<string>(""); // Type for OTP
  const [otpSessionId, setOtpSessionId] = useState<string>(""); // OTP session ID
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // OTP sent status
  const [isLoading, setIsLoading] = useState<boolean>(false); // Type for loading state
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // Type for verifying OTP
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("userId");
      if (storedUserId) {
        router.push("/l4/dashboard");
      }
    }
  }, [router]);

  // Send OTP
  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactNo || !/^\d{10}$/.test(contactNo)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/${contactNo}/AUTOGEN3/SVD`
      );
      const data = await response.json();
      if (data.Status === "Success") {
        setOtpSessionId(data.Details);
        setIsOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and login
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    setIsVerifying(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();
      
      if (verifyData.Status === "Success") {
        // OTP verified, now login
        const loginResponse = await fetch("/api/l4/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, contactNo }),
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
          sessionStorage.setItem("userId", userId);
          alert("Login successful!");
          router.push("/l4/dashboard");
        } else {
          alert(loginData.message || "Login failed.");
        }
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSendOtp}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black mt-4">Login</h2>
        <label className="block mb-4">
          <span className="text-gray-700">User ID</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            required
            disabled={isOtpSent}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Contact Number</span>
          <input
            type="text"
            value={contactNo}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setContactNo(value);
            }}
            placeholder="Enter your 10-digit phone number"
            required
            disabled={isOtpSent}
            maxLength={10}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
          />
        </label>
        
        {isOtpSent && (
          <label className="block mb-4">
            <span className="text-gray-700">Enter OTP</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
            />
          </label>
        )}
        
        {!isOtpSent ? (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-2 rounded-md text-white ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className={`w-full p-2 rounded-md text-white ${
                isVerifying
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify OTP & Login"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOtpSent(false);
                setOtp("");
                setOtpSessionId("");
              }}
              className="w-full p-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Resend OTP
            </button>
          </div>
        )}
      </form>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
