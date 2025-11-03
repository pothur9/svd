"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const levels = [
  // { name: "Sri 1008 jagdhguru", login: "/l1/login", bgColor: "bg-yellow-100" },
   { name: "Sri Lingayatha Veerashiva ಶ್ರೀ ವೀರಶೈವ ಲಿಂಗಾಯತ", login: "/l4/login", signup: "/l4/signup", bgColor: "bg-pink-100" },
  { name: "Sri Veerashaiva Jangama ಶ್ರೀ ವೀರಶೈವ ಜಂಗಮ", login: "/l3/login", signup: "/l3/signup", bgColor: "bg-green-100" },
   { name: "Sri 108 Shivachryaru ಶ್ರೀ 108 ಶಿವಾಚಾರ್ಯರು", login: "/l2/login", bgColor: "bg-[#F1C338]" },
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
     <p className="text-gray-950 font-extrabold bg-yellow-300/90 px-3 py-1 rounded-md shadow-md ring-1 ring-yellow-400">ಧರ್ಮೋ ರಕ್ಷತಿ ರಕ್ಷಿತಃ  </p>
     <p className="text-gray-900 font-bold bg-yellow-200/70 px-3 py-1 rounded-md shadow-sm mt-2">ನಾವು ಧರ್ಮವನ್ನು ರಕ್ಷಿಸಿದರೆ ಧರ್ಮವು ನಮ್ಮನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.</p>
      <Image
        className="mb-4"
        src="/logomain1.png"
        alt="Logo"
        width={200}
        height={48}
        priority
      />
      {/* <div className="mt-2 mb-4">
        <a
          href="https://wa.me/916360064505"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white shadow hover:bg-green-700"
        >
          <span className="inline-flex items-center justify-center bg-white rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
              <path fill="#25D366" d="M19.11 17.09c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.47-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.88 1.22 3.08c.15.2 2.11 3.22 5.1 4.51.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35z"/>
              <path fill="#25D366" d="M27.27 4.73C24.4 1.86 20.83.32 17.02.32 9.33.32 3.09 6.56 3.09 14.25c0 2.47.66 4.88 1.9 7.01L2.3 29.7l8.63-2.63c2.06 1.12 4.38 1.71 6.73 1.71 7.69 0 13.93-6.24 13.93-13.93 0-3.71-1.45-7.28-4.32-10.12zM17.66 26.54c-2.14 0-4.22-.57-6.04-1.64l-.43-.25-5.12 1.56 1.57-4.99-.28-.46c-1.16-1.91-1.77-4.1-1.77-6.35 0-6.8 5.53-12.33 12.33-12.33 3.29 0 6.38 1.28 8.71 3.61 2.33 2.33 3.61 5.43 3.61 8.71 0 6.8-5.53 12.33-12.33 12.33z"/>
            </svg>
          </span>
          <span className="text-sm font-semibold">Helpline: +91 6360 064 505</span>
        </a>
      </div> */}
      <div className="w-full max-w-2xl">
        <div className="flex gap-3 p-1 bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-scroll">
          {levels.map((level) => (
            <button
              key={level.name}
              onClick={() => setSelectedLevel(level)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedLevel.name === level.name
                  ? `${level.bgColor} text-gray-900 shadow`
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
                  Create account
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
      <div className="w-full max-w-2xl mt-6 mb-4">
        <p className="text-center text-gray-900 font-semibold mb-2">
          To know how to create account, see this video
        </p>
        <div className="relative w-full h-screen sm:h-64 md:h-72">
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg shadow"
            src="https://www.youtube.com/embed/6pKNEqrw16A"
            title="How to create account"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
<div className="mt-2 mb-4">
  <a
    href="https://wa.me/916360064505"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white shadow hover:bg-green-700 transition-all"
  >
    <span className="inline-flex items-center justify-center bg-white rounded-full p-1">
      {/* ✅ Perfect WhatsApp Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width="22"
        height="22"
        aria-hidden="true"
      >
        <path
          fill="#25D366"
          d="M256.064 0C114.849 0 0 114.844 0 256.056c0 45.177 11.854 89.385 34.353 128.277L24.067 512l131.757-34.537c37.421 20.463 79.486 31.234 122.313 31.234h.001C397.266 508.697 512 393.85 512 252.637 512 113.016 397.112 0 256.064 0z"
        />
        <path
          fill="#fff"
          d="M386.006 369.893c-5.776 16.19-28.778 29.68-47.221 33.605-12.557 2.665-28.838 4.782-94.364-19.976-79.136-30.927-129.905-107.066-133.847-112.153-3.942-5.086-31.919-42.52-31.919-81.088s19.725-57.62 26.732-65.66c6.974-8.04 15.095-10.1 20.13-10.1 5.034 0 10.06.052 14.484.265 4.64.232 10.847-.566 16.957 12.948 6.11 13.54 20.765 47.02 22.58 50.44 1.815 3.43 3.03 7.439.58 12.055-2.451 4.617-3.654 7.442-7.172 11.41-3.518 3.99-7.403 8.93-10.564 12.025-3.518 3.535-7.18 7.31-3.053 14.305 4.13 6.984 18.398 30.25 39.488 48.974 27.165 24.074 49.58 31.543 57.011 34.988 7.432 3.445 11.722 2.945 15.853-1.732 4.141-4.676 18.214-21.254 23.06-28.507 4.846-7.254 9.693-6.069 16.379-3.513 6.666 2.555 42.13 19.863 49.293 23.467 7.183 3.604 11.96 5.349 13.67 8.318 1.699 2.96 1.699 17.16-4.066 33.35z"
        />
      </svg>
    </span>
    <span className="text-sm font-semibold">Helpline: +91 6360 064 505</span>
  </a>
</div>


      <div className="-mt-2 mb-6">
        <a
          href="tel:+916360064505"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-all"
        >
          <span className="inline-flex items-center justify-center bg-white rounded-full p-1">
            {/* Phone icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden="true"
            >
              <path fill="#2563EB" d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C11.85 22 2 12.15 2 1a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.27.2 2.47.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z"/>
            </svg>
          </span>
          <span className="text-sm font-semibold">Call: +91 6360 064 505</span>
        </a>
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
