// pages/login.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch('/api/l1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }), // Send userId and password to the server
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // If the response is successful
        sessionStorage.setItem('userId', userId); // Store userId in session storage
        alert('Login successful!'); // Notify the user
        router.push('/l1/dashboard'); // Redirect to dashboard or another page
      } else {
        alert(data.message); // Show error message if login fails
      }
    } catch (error) {
      console.error('Error during login:', error); // Log any errors
      alert('An error occurred. Please try again.'); // Notify the user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <label className="block mb-4">
          <span className="text-gray-700">User ID</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
          />
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
