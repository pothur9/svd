"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../footer/footer";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Set loading to true when login starts

    try {
      const response = await fetch("/api/l1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }), // Send userId and password to the server
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        // If the response is successful
        sessionStorage.setItem("userId", userId); // Store userId in session storage
        // Notify the user
        router.push("/l1/dashboard"); // Redirect to dashboard or another page
      } else {
        alert(data.message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Error during login:", error); // Log any errors
      alert("An error occurred. Please try again."); // Notify the user
    } finally {
      setIsLoading(false); // Set loading to false after login attempt
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "80px", height: "auto" }}
            />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-black mt-6">
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
            />
          </label>
          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className={`w-full p-2 rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"} {/* Show loading text */}
          </button>
          <p className="text-center mt-4">
            Don't have an account?
            <a
              href="/l1/signup"
              className="text-blue-500 hover:text-blue-700"
            >
              &nbsp; Move to Signup
            </a>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
