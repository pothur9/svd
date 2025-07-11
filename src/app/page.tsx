"use client";
import Image from "next/image";
import Link from "next/link";

const levels = [
  { name: "Level 2", login: "/l2/login", signup: "/l2/signup", bgColor: "bg-blue-100" },
  { name: "Level 3", login: "/l3/login", signup: "/l3/signup", bgColor: "bg-green-100" },
  { name: "Level 4", login: "/l4/login", signup: "/l4/signup", bgColor: "bg-pink-100" },
];

export default function Home() {
  // Sample logo color (adjust as needed)
  const logoBorderColor = "#fbbf24"; // Amber-400 as placeholder

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-10">
      <Image
        className="mb-10 "
        src="/logomain1.png"
        alt="Logo"
        width={180}
        height={38}
        priority
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center items-stretch">
        {levels.map((level) => (
          <div
            key={level.name}
            className={`flex flex-col items-center rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl ${level.bgColor} border-4 p-8 min-h-[300px] w-full max-w-xs mx-auto`}
            style={{ borderColor: logoBorderColor }}
          >
            <h2 className="text-2xl font-extrabold mb-8 text-center w-full border-b pb-3 border-gray-200 tracking-wide text-gray-800">
              {level.name}
            </h2>
            <div className="flex flex-col gap-4 w-full items-center mt-4">
              <Link
                href={level.login}
                className="w-36 text-center py-2 rounded-full bg-[#fbbf24] text-white font-semibold shadow-md hover:bg-[#f59e1b] focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-colors text-base"
              >
                Login
              </Link>
              <Link
                href={level.signup}
                className="w-36 text-center py-2 rounded-full border-2 border-[#fbbf24] text-[#fbbf24] font-semibold shadow-md hover:bg-[#fbbf24] hover:text-white focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-colors text-base"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-16 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} SVD. All rights reserved.
      </footer>
    </div>
  );
}
