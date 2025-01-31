// components/UserDataDisplay.tsx
"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

// Define the type for user data
interface UserData {
  username: string;
  history: string;
  gurusTimeline: string;
  specialDevelopments: string;
  institutes: string;
}

export default function UserDataDisplay(): JSX.Element {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const username = typeof window !== "undefined" ? sessionStorage.getItem("username") : null; // Fetch username from session storage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!username) {
          setError("No username found in session storage.");
          return;
        }

        const response = await fetch(`/api/l1/history/${username}`);
        if (!response.ok) {
          throw new Error("History is not Present");
        }
        const data: UserData = await response.json();
        setUserData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
          console.error("Error fetching user data:", error.message);
        } else {
          setError("An unexpected error occurred.");
          console.error("Unexpected error:", error);
        }
      }

    };

    fetchUserData();
  }, [username]);

  if (error) {
    return <div className="text-red-600 font-semibold p-4">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-gray-600 p-4">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <br /><br />
      <div className="bg-slate-200">
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
                {userData.history || "History is not present."}
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
        <br /><br />
      </div>
      <Footer />
    </>
  );
}
