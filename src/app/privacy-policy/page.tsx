import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – SSVD",
  description: "Privacy policy for the Sanathanaveershivadharma (SVD) application.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-yellow-300 shadow-sm py-4 px-6 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logomain1.png" alt="SVD Logo" width={48} height={48} priority />
          <span className="font-bold text-gray-900 text-lg">SSVD</span>
        </Link>
        <span className="text-gray-400">|</span>
        <h1 className="text-gray-700 font-semibold text-base">Privacy Policy</h1>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: March 5, 2026</p>

        <section className="mb-8">
          <p className="leading-relaxed text-gray-700">
            Welcome to the <strong>Sanathanaveershivadharma (SVD)</strong> application. We are
            committed to protecting your personal information and your right to privacy. This Privacy
            Policy explains how we collect, use, and safeguard your information when you use our
            application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            We may collect the following types of information when you register or use the app:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
            <li>Full name</li>
            <li>Mobile number / phone number</li>
            <li>Address and district information</li>
            <li>Profile photographs (where applicable)</li>
            <li>Community or caste affiliation (for directory purposes)</li>
            <li>Login credentials (stored securely)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
            <li>To create and manage your user account</li>
            <li>To display your profile in the community directory</li>
            <li>To facilitate communication within the community</li>
            <li>To send important notifications related to the community</li>
            <li>To improve our application and services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Sharing of Information</h2>
          <p className="leading-relaxed text-gray-700">
            We do <strong>not</strong> sell, trade, or rent your personal information to third
            parties. Your information is only accessible to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2 mt-3">
            <li>Authorized administrators of the SVD platform</li>
            <li>Other verified community members (limited profile details only)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
          <p className="leading-relaxed text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized access, alteration, disclosure, or destruction. However, no
            method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
          <p className="leading-relaxed text-gray-700">
            We retain your personal information for as long as your account is active or as needed
            to provide you services. You may request deletion of your account and data at any time
            by contacting us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Children&apos;s Privacy</h2>
          <p className="leading-relaxed text-gray-700">
            Our application is not directed to children under the age of 13. We do not knowingly
            collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
          <p className="leading-relaxed text-gray-700 mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
          <p className="leading-relaxed text-gray-700 mb-2">
            If you have any questions or concerns about this Privacy Policy or our data practices,
            please contact us:
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-gray-800 space-y-1">
            <p>
              <strong>Helpline:</strong>{" "}
              <a href="tel:+916360064505" className="text-blue-700 underline">
                +91 6360 064 505
              </a>
            </p>
            <p>
              <strong>WhatsApp:</strong>{" "}
              <a
                href="https://wa.me/916360064505"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline"
              >
                +91 6360 064 505
              </a>
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p className="leading-relaxed text-gray-700">
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated date. We encourage you to review this policy periodically.
          </p>
        </section>

        <div className="border-t border-gray-200 pt-6 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-500 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-500 text-xs py-4 border-t border-gray-200 bg-white">
        &copy; {new Date().getFullYear()} SVD. All rights reserved.
      </footer>
    </div>
  );
}
