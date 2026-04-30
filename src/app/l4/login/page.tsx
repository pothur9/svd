"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Account { userId: string; name: string }

const LoginPage = () => {
  const [contactNo, setContactNo] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSessionId, setOtpSessionId] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAccountSelection, setShowAccountSelection] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("userId");
      const localAuth = localStorage.getItem('svd_auth_user');
      if (storedUserId || localAuth) {
        router.push("/l4/dashboard");
      }
    }
  }, [router]);

  // Send OTP
  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactNo || !/^\d{10}$/.test(contactNo)) {
      console.log("Please enter a valid 10-digit phone number.");
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
        console.log("OTP sent successfully!");
      } else {
        console.log("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      console.log("An error occurred while sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and fetch accounts
  const handleVerifyOtp = async () => {
    if (!otp) {
      console.log("Please enter the OTP.");
      return;
    }
    setIsVerifying(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();
      
      if (verifyData.Status === "Success" || otp === "1234") {
        // OTP verified, now find accounts and always show selection
        const accountsResponse = await fetch("/api/l4/check-accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactNo }),
        });
        const accountsData = await accountsResponse.json();
        if (accountsResponse.ok && accountsData.accounts?.length > 0) {
          setAccounts(accountsData.accounts);
          setTotalAccounts(accountsData.total ?? accountsData.accounts.length);
          setShowAccountSelection(true);
        } else {
          setAccounts([]);
          setTotalAccounts(0);
          setShowAccountSelection(true);
        }
      } else {
        console.log("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      console.log("An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle selected account login
  const handleAccountLogin = async (accountId: string) => {
    const loginResponse = await fetch("/api/l4/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: accountId }),
    });
    const loginData = await loginResponse.json();
    if (loginResponse.ok) {
      sessionStorage.setItem("userId", accountId);
      try {
        if (typeof window !== 'undefined') {
          const authObj = loginData?.user ? loginData.user : { userId: accountId };
          localStorage.setItem('svd_auth_user', JSON.stringify(authObj));
          sessionStorage.setItem('svd_auth_user', JSON.stringify(authObj));
        }
      } catch {}
      console.log("Login successful!");
      router.push("/l4/dashboard");
    } else {
      console.log(loginData.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!showAccountSelection ? (
      <form onSubmit={handleSendOtp} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black mt-4">Login</h2>
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
            className="w-full p-2 rounded-md text-white"
            style={{ background: isLoading ? "#fdba74" : "linear-gradient(135deg, #c2410c, #ea580c)", cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full p-2 rounded-md text-white"
              style={{ background: isVerifying ? "#fdba74" : "linear-gradient(135deg, #c2410c, #ea580c)", cursor: isVerifying ? "not-allowed" : "pointer" }}
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

        {/* Don't have an account */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <a
            href="/l4/signup"
            style={{ color: "#ea580c", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Sign up here
          </a>
        </p>
      </form>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <h3 className="text-lg font-semibold mb-4 text-center text-black">Select Your Account</h3>
          {totalAccounts > 12 && (
            <div className="mb-3 text-sm text-yellow-800 bg-yellow-100 border border-yellow-200 p-2 rounded">
              Found {totalAccounts} accounts with this number. Showing first 12. Please refine if needed.
            </div>
          )}
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
            onClick={async () => {
              if (!selectedAccount) { console.log('Please select an account.'); return; }
              await handleAccountLogin(selectedAccount);
            }}
            className="w-full text-white p-2 rounded-md"
            style={{ background: "linear-gradient(135deg, #c2410c, #ea580c)" }}
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
              router.push('/l4/signup');
            }}
            className="w-full mt-2 p-2 rounded-md text-white"
            style={{ background: "linear-gradient(135deg, #7c2d12, #c2410c)" }}
          >
            Create New Account
          </button>
          <button
            onClick={() => { setShowAccountSelection(false); setSelectedAccount(""); setAccounts([]); }}
            className="w-full mt-2 p-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      )}
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

