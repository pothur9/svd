"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthManager from "../../../lib/auth";

interface Account {
  userId: string;
  name: string;
}

const LoginPage = () => {
  const [contactNo, setContactNo] = useState<string>(""); // State for contact number
  const [otp, setOtp] = useState<string>(""); // State for OTP
  const [otpSessionId, setOtpSessionId] = useState<string>(""); // OTP session ID
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // OTP sent status
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to manage loading
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // State for verifying OTP
  const [accounts, setAccounts] = useState<Account[]>([]); // Multiple accounts for selection
  const [showAccountSelection, setShowAccountSelection] = useState<boolean>(false); // Show account selection
  const [selectedAccount, setSelectedAccount] = useState<string>(""); // Selected account ID
  const hasCheckedAuth = useRef<boolean>(false); // Track if auth has been checked
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!hasCheckedAuth.current && AuthManager.isAuthenticated()) {
      hasCheckedAuth.current = true;
      router.replace("/l3/dashboard");
    } else {
      hasCheckedAuth.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send OTP
  const handleSendOtp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!contactNo || !/^\d{10}$/.test(contactNo)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${contactNo}/AUTOGEN3/SVD`
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

  // Verify OTP and check for accounts
  const handleVerifyOtp = async (): Promise<void> => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }
    setIsVerifying(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success") {
        // Check for accounts with this phone number
        const accountsResponse = await fetch("/api/l3/check-accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactNo }),
        });

        const accountsData = await accountsResponse.json();

        if (accountsResponse.ok && accountsData.accounts?.length > 0) {
          setAccounts(accountsData.accounts);
          setShowAccountSelection(true);
        } else {
          // No accounts found - still show selection UI so user can create a new account
          setAccounts([]);
          setShowAccountSelection(true);
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

  // Handle account selection and login
  const handleAccountLogin = async (accountId: string) => {
    try {
      const loginResponse = await fetch("/api/l3/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: accountId }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // Store user data persistently
        AuthManager.setAuthUser({
          userId: accountId,
          name: loginData.user.name,
          contactNo: loginData.user.contactNo,
          peeta: loginData.user.peeta,
        });

        alert("Login successful!");
        router.push("/l3/dashboard");
      } else {
        alert(loginData.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  };

  // Handle account selection
  const handleAccountSelection = async () => {
    if (!selectedAccount) {
      alert("Please select an account.");
      return;
    }
    await handleAccountLogin(selectedAccount);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" style={{marginTop:"-80px"}}>
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black mt-4">
          Login
        </h2>

        {!showAccountSelection ? (
          <form onSubmit={handleSendOtp}>
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
                className={`w-full text-white p-2 rounded-md ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
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
                  className={`w-full text-white p-2 rounded-md ${
                    isVerifying
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isVerifying ? "Verifying..." : "Verify OTP"}
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
        ) : (
          // Account Selection
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center text-black">
              Select Your Account
            </h3>
            <div className="space-y-2 mb-4">
              {accounts.map((account) => (
                <div key={account.userId}>
                  <input
                    type="radio"
                    id={account.userId}
                    name="account"
                    value={account.userId}
                    checked={selectedAccount === account.userId}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor={account.userId} className="text-gray-700">
                    {account.name} ({account.userId})
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={handleAccountSelection}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Login to Selected Account
            </button>
            <button
              onClick={() => {
                try {
                  if (typeof window !== 'undefined') {
                    sessionStorage.clear();
                    localStorage.clear();
                  }
                } catch {}
                router.push('/l3/signup');
              }}
              className="w-full mt-2 p-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Create New Account
            </button>
            <button
              onClick={() => {
                setShowAccountSelection(false);
                setSelectedAccount("");
                setAccounts([]);
              }}
              className="w-full mt-2 p-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <span className="text-gray-700">Don&apos;t have an account? </span>
          <a href="/l3/signup" className="text-blue-500 hover:text-blue-700 font-medium">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
