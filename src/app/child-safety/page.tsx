"use client";

import Link from "next/link";

export default function ChildSafetyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white/80 border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
          Child Safety Standards
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          This page describes how SVLD complies with Play Store child safety requirements,
          including standards against child sexual abuse and exploitation (CSAE) and
          our reporting practices.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Safety Standards Against CSAE
          </h2>
          <p className="text-gray-700 mb-3">
            SVLD strictly prohibits any content, behavior, or activity that involves
            child sexual abuse and exploitation (CSAE) or child sexual abuse material
            (CSAM). This includes, but is not limited to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Uploading, sharing, or distributing any CSAM or exploitative content involving minors.</li>
            <li>Using the app to groom, solicit, or otherwise exploit minors in any way.</li>
            <li>Sharing links or directing others to CSAM or exploitative material hosted elsewhere.</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Any violation of these standards may result in immediate account suspension or
            termination, and where appropriate, reporting to relevant authorities and platforms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Safety Standards URL
          </h2>
          <p className="text-gray-700 mb-3">
            This page serves as the externally published standards URL for SVLD&apos;s
            policies against child sexual abuse and exploitation (CSAE).
          </p>
          <p className="text-gray-700">
            You may provide this page&apos;s link in the Play Store console as the{" "}
            <span className="font-semibold">Safety standards URL</span>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Reporting and In‑App Child Safety Concerns
          </h2>
          <p className="text-gray-700 mb-3">
            SVLD allows users to report child safety concerns in‑app. Reports related
            to suspected CSAE or CSAM are treated with the highest priority. We review
            such reports promptly and take appropriate action, which may include:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Removing reported content that violates our child safety standards.</li>
            <li>Suspending or terminating accounts involved in CSAE or CSAM.</li>
            <li>Reporting incidents to relevant regional and national authorities, as required by law.</li>
          </ul>
          <p className="text-gray-700 mt-3">
            My app complies with all relevant child safety laws, and reports to regional and
            national authorities, as applicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Designated Contact for Child Safety
          </h2>
          <p className="text-gray-700 mb-3">
            The designated point of contact for questions about SVLD&apos;s child sexual
            abuse material (CSAM) prevention practices and compliance is:
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-800">
            <p className="font-semibold">Email:</p>
            <p>
              <a
                href="mailto:chowdaryp697@gmail.com"
                className="text-blue-700 underline break-all"
              >
                chowdaryp697@gmail.com
              </a>
            </p>
            <p className="text-sm text-gray-700 mt-2">
              This is the contact email address associated with this developer account.
              It will update automatically if the developer contact email address is changed.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Legal Compliance and Reporting
          </h2>
          <p className="text-gray-700 mb-3">
            SVLD is committed to complying with all applicable child protection and
            child safety laws in the regions where the app is available. Where
            required or appropriate, we report suspected CSAE or CSAM to relevant
            regional and national authorities.
          </p>
          <p className="text-gray-700">
            For more information about reporting requirements and guidelines, please
            refer to the official Play Store help resources and the relevant
            authorities in your jurisdiction.
          </p>
        </section>

        <section className="border-t border-gray-200 pt-4 text-sm text-gray-600">
          <p>
            By using SVLD, users agree not to engage in any activity that involves
            child sexual abuse, exploitation, or related illegal conduct. We reserve
            the right to update these standards to comply with evolving legal and
            platform requirements.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

