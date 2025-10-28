"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const levels = [
  // { name: "Sri 1008 jagdhguru", login: "/l1/login", bgColor: "bg-yellow-100" },
  { name: "Sri 108 Shivachryaru ಶ್ರೀ 108 ಶಿವಾಚಾರ್ಯರು", login: "/l2/login", bgColor: "bg-blue-100" },
  { name: "Sri guru jangam ಶ್ರೀ ಗುರು ಜಂಗಮ", login: "/l3/login", signup: "/l3/signup", bgColor: "bg-green-100" },
  { name: "Sri Lingayatha Veerashiva ಶ್ರೀ ವೀರಶೈವ ಲಿಂಗಾಯತ", login: "/l4/login", signup: "/l4/signup", bgColor: "bg-pink-100" },
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
        className="mb-4"
        src="/logomain1.png"
        alt="Logo"
        width={200}
        height={48}
        priority
      />
      <div className="w-full max-w-2xl">
        <div className="flex gap-3 p-1 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          {levels.map((level) => (
            <button
              key={level.name}
              onClick={() => setSelectedLevel(level)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedLevel.name === level.name
                  ? 'bg-gray-100 text-gray-900 shadow'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>

        <div
          className={`rounded-2xl shadow-xl ${selectedLevel.bgColor} border p-6 sm:p-8`}
          style={{ borderColor: logoBorderColor }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-white/70 flex items-center justify-center text-3xl text-gray-700 mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedLevel.name}</h2>
            <div className="mt-6 w-full max-w-sm">
              {selectedLevel.signup && (
                <Link
                  href={selectedLevel.signup}
                  className="block w-full text-center py-3 rounded-lg bg-green-700 text-white font-semibold shadow hover:bg-green-800"
                >
                  Sign Up
                </Link>
              )}
              <div className="mt-3" />
              <Link
                href={selectedLevel.login}
                className="block w-full text-center py-3 rounded-lg bg-white text-gray-900 font-semibold border border-gray-300 hover:bg-gray-50"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer
        className="mt-4 mb-0 w-full text-gray-200 text-xs text-center py-2 px-4 rounded-none shadow-lg border-4 border-solid"
        style={{ borderColor: logoBorderColor }}
      >
      
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
          <div className="text-black mt-3">&copy; {new Date().getFullYear()} SVD. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
