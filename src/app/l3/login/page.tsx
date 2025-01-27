"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage = () => {
  const [userId, setUserId] = useState<string>(""); // userId as string
  const [password, setPassword] = useState<string>(""); // password as string
  const [isLoading, setIsLoading] = useState<boolean>(false); // isLoading as boolean
  const router = useRouter();

  // Define the type of the event for the form submission
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/l3/login", {
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
        alert("Login successful!"); // Notify the user
        router.push("/l3/dashboard"); // Redirect to dashboard or another page
      } else {
        alert(data.message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Error during login:", error); // Log any errors
      alert("An error occurred. Please try again."); // Notify the user
    } finally {
      setIsLoading(false); // Stop loading
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
        <h2 className="text-2xl font-bold mb-6 text-center text-black mt-4">Login</h2>
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
          disabled={isLoading} // Disable button while loading
          className={`w-full p-2 rounded-md text-white ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
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
