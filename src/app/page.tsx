"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const levels = [
  { name: "Sri 1008 jagdhguru", login: "/l1/login", bgColor: "bg-yellow-100" },
  { name: "Sri 108 Prabhu Shivachryaru", login: "/l2/login", signup: "/l2/signup", bgColor: "bg-blue-100" },
  { name: "Sri guru jangam", login: "/l3/login", signup: "/l3/signup", bgColor: "bg-green-100" },
  { name: "Sri veerashiva", login: "/l4/login", signup: "/l4/signup", bgColor: "bg-pink-100" },
];

export default function Home() {
  // Sample logo color (adjust as needed)
  const logoBorderColor = "#fbbf24"; // Amber-400 as placeholder
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in and redirect to appropriate dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        // Check which level the user belongs to by trying to fetch their data
        const checkUserLevel = async () => {
          try {
            // Try L1 first
            const l1Response = await fetch(`/api/l1/userdata/${userId}`);
            if (l1Response.ok) {
              router.push("/l1/dashboard");
              return;
            }

            // Try L2
            const l2Response = await fetch(`/api/l2/dashboard/${userId}`);
            if (l2Response.ok) {
              router.push("/l2/dashboard");
              return;
            }

            // Try L3
            const l3Response = await fetch(`/api/l3/dashboard/${userId}`);
            if (l3Response.ok) {
              router.push("/l3/dashboard");
              return;
            }

            // Try L4
            const l4Response = await fetch(`/api/l4/dashboard/${userId}`);
            if (l4Response.ok) {
              router.push("/l4/dashboard");
              return;
            }

            // If none work, clear the session and stay on home page
            sessionStorage.clear();
          } catch (error) {
            console.error("Error checking user level:", error);
            // If there's an error, clear session and stay on home page
            sessionStorage.clear();
          } finally {
            setIsCheckingAuth(false);
          }
        };

        checkUserLevel();
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [router]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbbf24] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-10">
      <Image
        className="mb-10 "
        src="/logomain1.png"
        alt="Logo"
        width={200}
        height={48}
        priority
      />
      <div
        className={`flex flex-col items-center rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl ${selectedLevel.bgColor} border-4 p-8 min-h-[300px] w-full max-w-xs mx-auto`}
        style={{ borderColor: logoBorderColor }}
      >
        <select
          className="mb-6 w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] text-lg font-semibold text-gray-700 bg-white"
          value={selectedLevel.name}
          onChange={e => {
            const level = levels.find(l => l.name === e.target.value);
            if (level) setSelectedLevel(level);
          }}
        >
          {levels.map(level => (
            <option key={level.name} value={level.name}>
              {level.name}
            </option>
          ))}
        </select>
        <h2 className="text-2xl font-extrabold mb-8 text-center w-full border-b pb-3 border-gray-200 tracking-wide text-gray-800">
          {selectedLevel.name}
        </h2>
        <div className="flex flex-col gap-4 w-full items-center mt-4">
          <Link
            href={selectedLevel.login}
            className="w-36 text-center py-2 rounded-full bg-[#fbbf24] text-white font-semibold shadow-md hover:bg-[#f59e1b] focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-colors text-base"
          >
            Login
          </Link>
          {selectedLevel.signup && (
            <Link
              href={selectedLevel.signup}
              className="w-36 text-center py-2 rounded-full border-2 border-[#fbbf24] text-[#fbbf24] font-semibold shadow-md hover:bg-[#fbbf24] hover:text-white focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-colors text-base"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
      <footer className="mt-4 mb-0 w-full text-gray-200 text-xs text-center py-2 px-4 rounded-none shadow-lg">
        {/* <div>&copy; {new Date().getFullYear()} SVD. All rights reserved.</div> */}
        <div className="mt-2 text-[12px] leading-relaxed text-gray-300 max-w-3xl mx-auto">
          {/* <div className="font-semibold text-gray-100 mb-1">ಮಾಗಮದಶಮನ & ಅಪಪಣ ಯಿಂತ</div>
          <div className="mb-2">1008 ಶಿರೀರ್ದ್ಕ್ಾಶಿ ಜಗದುುರು ಶಿರೀಡಾ, ಚಿಂದರ ಶ ೀಖರ ಶಿವಾಚಾಯ ಮಭಗವತಾಪದರು.</div>
          <div className="font-semibold text-gray-100 mb-1">ಮಾಗಮದಶಮನ</div>
          <div className="mb-2">ಶಿರೀಷ, ಬರ, ಅಭಿನವ ಸಿದುಲಿಂಗ ಶಿವಾಚಾಯ ಮರ್ಹಾಸಾವಮಿಗಳು, ಪಿಂಚವಣಗಿಸಿಂಸಾಾನಹರ ೀರ್ಠ್ಬಳಗ ೀರಿ, ಜಿ, ಕ್ ಪಪಳ. ಹರಗಿನಡ ೀಣಿ, ಬಳಾಾರಿಜಿ/ತಾ.I</div>
          <div className="font-semibold text-gray-100 mb-1">Designed and Developed By</div>
          <div className="mb-2">ಅಪಿಕ್ ೀಶನ್ಅಭಿವೃದ್ಧಿಪಡಿಸಿದವರು: <br/>Mr. Prashant Kumar VM and Prasanna Kumar P</div>
          <div className="mb-2">ಶಿರೀ: ಪರಶಾಿಂತ್ಕುಮಾರ್.ವ.ಎಿಂರ್ತು್ಪರಸನುಕುಮಾರ್.ಪಿ</div>
          <div className="mb-2">Korlagundi (Post), Bellary (T&D) Karnataka (State), Bharatha</div> */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-2">
            <Image src="/footer1.jpg" alt="Footer 1" width={580} height={580} className="rounded shadow w-full max-w-xs md:max-w-md lg:max-w-lg" />
            <Image src="/footer2.jpg" alt="Footer 2" width={380} height={380} className="rounded shadow w-full max-w-xs md:max-w-sm lg:max-w-md" />
          </div>
        </div>
      </footer>
    </div>
  );
}
