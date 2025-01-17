"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading
  const router = useRouter();

  const handleLogin = async (e) => {
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
        alert(data.message); // Show error message if login fails
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
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoading} // Disable input during loading
          />
        </label>
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
      </form>
    </div>
  );
};

export default LoginPage;
