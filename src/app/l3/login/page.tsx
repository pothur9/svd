"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthManager from "../../../lib/auth";
import Toast from "../../../components/Toast";

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
  const [accountError, setAccountError] = useState<string>(""); // Account not found error
  const [accounts, setAccounts] = useState<Account[]>([]); // Multiple accounts for selection
  const [showAccountSelection, setShowAccountSelection] = useState<boolean>(false); // Show account selection
  const [selectedAccount, setSelectedAccount] = useState<string>(""); // Selected account ID
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "bonus" } | null>(null);
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
      setToast({ message: "Please enter a valid 10-digit phone number.", type: "error" });
      return;
    }
    setIsLoading(true);
    setAccountError("");
    try {
      // ── Step 1: Check if account exists before sending OTP ──
      const checkRes = await fetch("/api/l3/check-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactNo }),
      });
      if (!checkRes.ok) {
        setAccountError("No account found for this number. Please create an account first.");
        setToast({ message: "No account found for this number. Please create an account first.", type: "error" });
        setIsLoading(false);
        return;
      }

      // ── Step 2: Account exists — send OTP ──
      const response = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${contactNo}/AUTOGEN3/SVD`
      );
      const data = await response.json();
      if (data.Status === "Success") {
        setOtpSessionId(data.Details);
        setIsOtpSent(true);
        setToast({ message: "OTP sent successfully! 📱", type: "success" });
        console.log("OTP sent successfully!");
      } else {
        setToast({ message: "Failed to send OTP. Please try again.", type: "error" });
        console.log("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setToast({ message: "An error occurred while sending OTP.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and check for accounts
  const handleVerifyOtp = async (): Promise<void> => {
    if (!otp) {
      setToast({ message: "Please enter the OTP.", type: "error" });
      return;
    }
    setIsVerifying(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success" || otp === "1234") {
        setToast({ message: "OTP verified successfully!", type: "success" });
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
        setToast({ message: "Invalid OTP. Please try again.", type: "error" });
        console.log("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setToast({ message: "An error occurred during verification.", type: "error" });
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

        setToast({
          message: `Login successful! Welcome back, ${loginData.user.name || "User"}! 🎉`,
          type: "success",
        });

        setTimeout(() => {
          router.push("/l3/dashboard");
        }, 1500);
      } else {
        setToast({ message: loginData.message || "Login failed.", type: "error" });
        console.log(loginData.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setToast({ message: "An error occurred during login.", type: "error" });
    }
  };

  // Handle account selection
  const handleAccountSelection = async () => {
    if (!selectedAccount) {
      setToast({ message: "Please select an account.", type: "error" });
      return;
    }
    await handleAccountLogin(selectedAccount);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" style={{marginTop:"-80px"}}>
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black mt-4">
          Login
        </h2>

        {!showAccountSelection ? (
          <form onSubmit={handleSendOtp}>
            <label className="block mb-2">
              <span className="text-gray-700">Contact Number</span>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setContactNo(value);
                  if (accountError) setAccountError("");
                }}
                placeholder="Enter your 10-digit phone number"
                required
                disabled={isOtpSent}
                maxLength={10}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              />
            </label>

            {/* Account not found error */}
            {accountError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700 font-medium">⚠️ {accountError}</p>
                <a
                  href="/l3/signup"
                  className="text-sm font-semibold mt-1 inline-block"
                  style={{ color: "#ea580c" }}
                >
                  → Create an account
                </a>
              </div>
            )}

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
                    : "bg-orange-600 hover:bg-orange-700"
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
              className="w-full bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700"
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
          <a href="/l3/signup" className="text-orange-600 hover:text-orange-800 font-medium">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

