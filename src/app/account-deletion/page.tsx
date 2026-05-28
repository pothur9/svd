import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Deletion â€“ SSVD",
  description:
    "Learn how to delete your SSVD account and understand what data is removed or retained.",
};

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-yellow-300 shadow-sm py-4 px-6 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logomain1.png" alt="SSVD Logo" width={48} height={48} priority />
          <span className="font-bold text-gray-900 text-lg">SSVD</span>
        </Link>
        <span className="text-gray-400">|</span>
        <h1 className="text-gray-700 font-semibold text-base">Account Deletion</h1>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 text-gray-800">

        {/* App / Developer identity */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8 flex items-start gap-4">
          <Image src="/logomain1.png" alt="SSVD Logo" width={56} height={56} className="rounded-lg shadow" />
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Sanathanaveershivadharma (SSVD)
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Developed &amp; managed by <strong>SVD Community Platform</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Contact:{" "}
              <a href="tel:  +919480111889" className="text-blue-700 underline">
                  +919480111889
              </a>
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Request Account Deletion</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 5, 2026</p>

        {/* â”€â”€ Section 1: What deletion means â”€â”€ */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            If you would like to permanently delete your <strong>SSVD</strong> account and all
            associated data, please follow the steps below. Once deleted, your account{" "}
            <strong>cannot be recovered</strong>.
          </p>
        </section>

        {/* â”€â”€ Section 2: Steps â”€â”€ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ðŸ“‹ Steps to Delete Your Account
          </h2>

          <ol className="space-y-4">
            {[
              {
                step: "1",
                title: "Visit the Delete Account page",
                desc: (
                  <>
                    Open the SSVD app or go to{" "}
                    <Link
                      href="/delete-account"
                      className="text-blue-700 underline font-medium hover:text-blue-900"
                    >
                      ssvd.app/delete-account
                    </Link>{" "}
                    in your browser. No login is required.
                  </>
                ),
              },
              {
                step: "2",
                title: "Enter your User ID",
                desc: "Type in the User ID that was assigned when you registered with SSVD.",
              },
              {
                step: "3",
                title: "Enter your registered Contact Number",
                desc:
                  "Provide the mobile number linked to your account. This is used to verify your identity before deletion.",
              },
              {
                step: "4",
                title: "Confirm you understand the action is permanent",
                desc:
                  "Check the confirmation checkbox to acknowledge that your data will be permanently removed.",
              },
              {
                step: "5",
                title: 'Click "Delete My Account"',
                desc:
                  'Press the red "Delete My Account" button. Your account will be permanently deleted immediately.',
              },
            ].map(({ step, title, desc }) => (
              <li
                key={step}
                className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 font-extrabold text-sm flex items-center justify-center">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-600 text-sm mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6">
            <Link
              href="/delete-account"
              id="delete-account-btn"
              className="inline-block px-6 py-3 rounded-lg bg-red-600 text-white font-bold shadow hover:bg-red-700 transition-colors text-sm"
            >
              ðŸ—‘ï¸ Go to Delete Account Page â†’
            </Link>
          </div>
        </section>

        {/* â”€â”€ Section 3: Alternative â€“ contact us â”€â”€ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            ðŸ“ž Alternative: Request via Phone / WhatsApp
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            If you are unable to use the online form, you can contact us directly and our team will
            process the deletion request within <strong>7 business days</strong>.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm text-gray-800">
            <p>
              ðŸ“ž{" "}
              <a href="tel:  +919480111889" className="text-blue-700 underline">
                 +919480111889
              </a>
            </p>
            <p>
              ðŸ’¬ WhatsApp:{" "}
              <a
                href="https://wa.me/919480111889"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline"
              >
                 +919480111889
              </a>
            </p>
          </div>
        </section>

        {/* â”€â”€ Section 4: Data table â”€â”€ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ðŸ—‚ï¸ Data Deleted vs. Data Retained
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            The following table details exactly what happens to each type of data when you delete
            your account.
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
                  {
                    type: "Name, Date of Birth, Gender",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Contact Number (Mobile)",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Address (Present & Permanent)",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Profile Photo",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Community / Caste / Peeta affiliation",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Occupation, Qualification, Language",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Login credentials (User ID, Password)",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Event participation records",
                    action: "ðŸ—‘ï¸ Permanently Deleted",
                    retention: "Deleted immediately",
                    deleted: true,
                  },
                  {
                    type: "Anonymised app usage / error logs",
                    action: "ðŸ”’ Retained (anonymised)",
                    retention: "Up to 30 days, then auto-purged",
                    deleted: false,
                  },
                ].map(({ type, action, retention, deleted }) => (
                  <tr key={type} className={deleted ? "bg-white" : "bg-yellow-50"}>
                    <td className="px-4 py-3 text-gray-800">{type}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        deleted ? "text-red-600" : "text-yellow-700"
                      }`}
                    >
                      {action}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            * Anonymised logs do not contain any personally identifiable information and cannot be
            used to identify you.
          </p>
        </section>

        {/* Back link */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-500 transition-colors text-sm"
          >
            â† Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 text-xs py-4 border-t border-gray-200 bg-white">
        <Link href="/privacy-policy" className="underline hover:text-gray-600 mr-3">
          Privacy Policy
        </Link>
        <Link href="/delete-account" className="underline hover:text-gray-600 mr-3">
          Delete Account
        </Link>
        &copy; {new Date().getFullYear()} SVD. All rights reserved.
      </footer>
    </div>
  );
}

