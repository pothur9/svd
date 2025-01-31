"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

interface UserData {
  username: string;
  history: string;
  gurusTimeline: string;
  specialDevelopments: string;
  institutes: string;
}

export default function UserDataDisplay() {
  const [userData, setUserData] = useState<UserData | null>(null); // State for user data
  const [error, setError] = useState<string | null>(null); // State for error
  const [username, setUsername] = useState<string | null>(null); // State for session storage value

  // Retrieve `peeta` from sessionStorage in useEffect to prevent SSR issues
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("peeta");
    if (!storedUsername) {
      setError("No username found in session storage.");
    } else {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return; // Wait until username is set

      try {
        const response = await fetch(`/api/l2/viewhistory/${encodeURIComponent(username)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data: UserData = await response.json(); // Explicitly type the response data
        setUserData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "An unexpected error occurred.");
          console.error("Error fetching user data:", error.message);
        } else {
          setError("An unexpected error occurred.");
          console.error("Unknown error:", error);
        }
      }
    };

    fetchUserData();
  }, [username]);

  // Render error message
  if (error) {
    return <div className="text-red-600 font-semibold p-4">Error: {error}</div>;
  }

  // Render loading message
  if (!userData) {
    return <div className="text-gray-600 p-4">Loading...</div>;
  }

  // Render the user data
  return (
    <>
      <Navbar />
      <div className="bg-slate-100 min-h-screen w-full">
        <br />
        <br />
        <br />
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-b-2 border-gray-300 pb-4">
            User Data Overview
          </h2>

          <article className="space-y-8">
            {/* User Name */}
            <section className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                User Name
              </h3>
              <p className="text-gray-900 text-lg font-medium">
                {userData.username}
              </p>
            </section>

            {/* History */}
            <section className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                History
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {userData.history}
              </p>
            </section>

            {/* Gurus Timeline */}
            <section className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Gurus Timeline
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {userData.gurusTimeline}
              </p>
            </section>

            {/* Special Developments */}
            <section className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Special Developments
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {userData.specialDevelopments}
              </p>
            </section>

            {/* Institutes */}
            <section className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Institutes
              </h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {userData.institutes}
              </p>
            </section>
          </article>
        </div>
        <br />
        <br />
      </div>
      <Footer />
    </>
  );
}
