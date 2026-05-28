"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Status = "idle" | "loading" | "success" | "error";

export default function DeleteAccountPage() {
  const [userId, setUserId] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim(), contactNo: contactNo.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setUserId("");
        setContactNo("");
        setConfirmed(false);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-yellow-300 shadow-sm py-4 px-6 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logomain1.png" alt="SSVD Logo" width={48} height={48} priority />
          <span className="font-bold text-gray-900 text-lg">SSVD</span>
        </Link>
        <span className="text-gray-400">|</span>
        <h1 className="text-gray-700 font-semibold text-base">Delete Account</h1>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">

        {/* â”€â”€ App / Developer identity (Play Store requirement) â”€â”€ */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8 flex items-start gap-4">
          <Image src="/logomain1.png" alt="SSVD Logo" width={56} height={56} className="rounded-lg shadow flex-shrink-0" />
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Sanathanaveershivadharma (SSVD)
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Developed &amp; managed by <strong>SVD Community Platform</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Helpline:{" "}
              <a href="tel:+919480111889" className="text-blue-700 underline">
                +919480111889
              </a>
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Delete Your Account</h1>
        <p className="text-sm text-gray-500 mb-8">
          This page is provided for Google Play Store compliance. You can permanently delete your
          SSVD account using the form below.
        </p>

        {/* â”€â”€ Steps (Play Store requirement) â”€â”€ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ðŸ“‹ How to Delete Your Account</h2>
          <ol className="space-y-3">
            {[
              { n: "1", title: "Enter your User ID", desc: "Type the User ID you received when you registered with SSVD." },
              { n: "2", title: "Enter your registered Contact Number", desc: "Provide the mobile number linked to your account. This verifies your identity." },
              { n: "3", title: "Confirm the action", desc: "Check the box to confirm you understand that deletion is permanent." },
              { n: "4", title: 'Click "Delete My Account"', desc: "Your account and all associated data will be permanently removed immediately." },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-700 font-extrabold text-sm flex items-center justify-center">
                  {n}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* â”€â”€ Data deletion / retention table (Play Store requirement) â”€â”€ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">ðŸ—‚ï¸ Data Deleted vs. Data Retained</h2>
          <p className="text-gray-600 text-sm mb-4">
            The table below explains what happens to each type of data when you request deletion.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-200">Data Type</th>
                  <th className="px-4 py-3 border-b border-gray-200">Action</th>
                  <th className="px-4 py-3 border-b border-gray-200">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { type: "Name, Date of Birth, Gender", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Contact Number (Mobile)", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Address (Present & Permanent)", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Profile Photo", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Community / Caste / Peeta affiliation", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Occupation, Qualification, Language", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Login credentials (User ID, Password)", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Event participation records", action: "ðŸ—‘ï¸ Permanently Deleted", retention: "Deleted immediately", del: true },
                  { type: "Anonymised error / server logs", action: "ðŸ”’ Retained (anonymised)", retention: "Up to 30 days, then auto-purged", del: false },
                ].map(({ type, action, retention, del }) => (
                  <tr key={type} className={del ? "bg-white" : "bg-yellow-50"}>
                    <td className="px-4 py-3 text-gray-800">{type}</td>
                    <td className={`px-4 py-3 font-semibold ${del ? "text-red-600" : "text-yellow-700"}`}>{action}</td>
                    <td className="px-4 py-3 text-gray-600">{retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            * Anonymised logs contain no personally identifiable information.
          </p>
        </section>

        {/* â”€â”€ Deletion Form â”€â”€ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ðŸ—‘ï¸ Request Deletion Now</h2>

          {/* Warning banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-2xl mt-0.5">âš ï¸</span>
            <div>
              <p className="font-bold text-red-700 text-sm">This action is permanent and cannot be undone</p>
              <p className="text-red-600 text-sm mt-1">
                Deleting your account will permanently remove all your personal data from the SSVD
                platform as described in the table above.
              </p>
            </div>
          </div>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">âœ…</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Account Deleted</h3>
              <p className="text-green-700 text-sm mb-6">{message}</p>
              <Link
                href="/"
                className="inline-block px-6 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleDelete}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5 max-w-md"
            >
              {/* User ID */}
              <div>
                <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNo" className="block text-sm font-semibold text-gray-700 mb-1">
                  Registered Contact Number
                </label>
                <input
                  id="contactNo"
                  type="tel"
                  required
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              {/* Confirmation checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-red-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  I understand that deleting my account is <strong>permanent</strong> and all my
                  data will be removed as described above.
                </span>
              </label>

              {/* Error message */}
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!confirmed || status === "loading"}
                className={`w-full py-3 rounded-lg font-bold text-white text-sm transition-all ${
                  confirmed && status !== "loading"
                    ? "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Deleting accountâ€¦
                  </span>
                ) : (
                  "Delete My Account"
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                Can&apos;t access your account?{" "}
                <a href="https://wa.me/919480111889" target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                  WhatsApp us
                </a>{" "}
                or{" "}
                <a href="tel:+919480111889" className="text-blue-600 underline">
                  Call   +919480111889
                </a>
              </p>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 text-xs py-4 border-t border-gray-200 bg-white">
        <Link href="/privacy-policy" className="underline hover:text-gray-600 mr-3">
          Privacy Policy
        </Link>
        &copy; {new Date().getFullYear()} SVD. All rights reserved.
      </footer>
    </div>
  );
}

