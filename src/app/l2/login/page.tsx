"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState<string>(""); // State for user ID
  const [password, setPassword] = useState<string>(""); // State for password
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to manage loading
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = sessionStorage.getItem("userId");
      if (storedUserId) {
        router.push("/l2/dashboard");
      }
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Set loading to true when login starts

    try {
      const response = await fetch("/api/l2/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }), // Send userId and password to the server
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        sessionStorage.setItem("userId", userId); // Store userId in session storage
        alert("Login successful!"); // Notify the user
        router.push("/l2/dashboard"); // Redirect to dashboard or another page
      } else {
        alert(data.message || "Login failed."); // Show error message if login fails
      }
    } catch (error) {
      console.error("Error during login:", error); // Log any errors
      alert("An error occurred. Please try again."); // Notify the user
    } finally {
      setIsLoading(false); // Reset loading state after login attempt
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm " style={{marginTop:"-80px"}}
      >
        <div className="flex justify-center">
          <Image src="/logomain1.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-black mt-4">
          Login
        </h2>
        <label className="block mb-4">
          <span className="text-gray-700">User ID</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
            disabled={isLoading} // Disable input during loading
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black"
            disabled={isLoading} // Disable input during loading
          />
        </label>
        <p className="text-right mt-1 mb-5">
            <a
              href="/l2/forgotpass"
              className="text-blue-500 hover:text-blue-700"
            >
             Forgot Password ?
            </a>
          </p>
        <button
          type="submit"
          className={`w-full text-white p-2 rounded-md ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? "Logging in..." : "Login"} {/* Show loading text */}
        </button>
        <div className="text-center mt-4">
          <span className="text-gray-700">Don&apos;t have an account? </span>
          <a href="/l2/signup" className="text-blue-500 hover:text-blue-700 font-medium">Sign up</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
