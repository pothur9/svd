"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "kn" | "te" | "hi";

export default function PrivacyPolicyContent() {
  const [lang, setLang] = useState<Lang>("en");

  const languages = [
    { code: "en", name: "English" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "te", name: "తెలుగు" },
    { code: "hi", name: "हिन्दी" },
  ] as const;

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 text-gray-800">
      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8 bg-gray-100 p-1.5 rounded-xl max-w-md mx-auto shadow-inner">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
              lang === l.code
                ? "bg-orange-600 text-white shadow-md scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-10 transition-all duration-300">
        {lang === "en" && (
          <article className="prose max-w-none text-gray-700 space-y-6">
            <header className="border-b border-gray-100 pb-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                PRIVACY POLICY
              </h1>
              <p className="text-md font-bold text-orange-600 mt-2">
                SANATHANA VEERASHAIVA LINGAYATHA TRUST – VIRTUAL CURRENCY / DIGITAL TOKEN SYSTEM
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
                <span><strong>Effective Date:</strong> May 28, 2026</span>
                <span>•</span>
                <span><strong>Version:</strong> 1.0</span>
              </div>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">1. INTRODUCTION</h2>
              <p className="leading-relaxed">
                Sanathana Veerashaiva Lingayatha Trust (&quot;Trust&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects the privacy and security of all members, users, donors, and participants using our virtual currency / digital token ecosystem.
              </p>
              <p className="leading-relaxed">
                This Privacy Policy explains how we collect, use, store, process, and protect personal information in connection with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital tokens / virtual currency issued by the Trust</li>
                <li>Membership transactions</li>
                <li>Donations and contribution records</li>
                <li>Wallet registration and verification</li>
                <li>Digital payment services</li>
                <li>Mobile applications and websites</li>
                <li>Community and event participation systems</li>
              </ul>
              <p className="leading-relaxed">
                This policy is designed to align with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Reserve Bank of India (RBI) guidelines applicable to digital payments and financial compliance</li>
                <li>Information Technology Act, 2000</li>
                <li>Digital Personal Data Protection Act, 2023 (India)</li>
                <li>Anti-Money Laundering (AML) principles</li>
                <li>Know Your Customer (KYC) requirements where applicable</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-red-50/50 border border-red-100 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-red-900">2. IMPORTANT REGULATORY DISCLAIMER</h2>
              <p className="leading-relaxed text-red-800">
                The Trust’s virtual currency / digital token:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-red-800">
                <li>Is NOT legal tender in India.</li>
                <li>Is NOT issued or guaranteed by the Reserve Bank of India.</li>
                <li>Shall NOT be represented as an official currency.</li>
                <li>Shall be used only within the permitted ecosystem, membership network, donation framework, or approved services of the Trust.</li>
                <li>Shall comply with all applicable Indian laws and regulatory requirements.</li>
              </ul>
              <p className="leading-relaxed text-xs text-red-700 italic">
                Users are advised that cryptocurrency and digital asset regulations in India may evolve from time to time.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">3. INFORMATION WE COLLECT</h2>
              <p className="leading-relaxed">We may collect the following categories of information:</p>

              <div className="space-y-3 pl-2">
                <div>
                  <h3 className="font-semibold text-gray-900">A. Personal Information</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Full name</li>
                    <li>Date of birth</li>
                    <li>Mobile number</li>
                    <li>Email address</li>
                    <li>Residential address</li>
                    <li>Government-issued identification documents</li>
                    <li>Membership identification details</li>
                    <li>Passport-sized photograph</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">B. Financial &amp; Transaction Information</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Wallet identification number</li>
                    <li>Transaction history</li>
                    <li>Token purchase and redemption records</li>
                    <li>Bank account details (where applicable)</li>
                    <li>UPI or payment transaction references</li>
                    <li>Donation and contribution records</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">C. Technical Information</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IP address</li>
                    <li>Device information</li>
                    <li>Browser type</li>
                    <li>Operating system</li>
                    <li>Login timestamps</li>
                    <li>Security logs</li>
                    <li>Application usage data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">D. Compliance Information</h3>
                  <p className="leading-relaxed text-sm mb-1">To comply with AML, fraud prevention, and RBI-aligned practices, we may collect:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>KYC verification records</li>
                    <li>Risk assessment data</li>
                    <li>Suspicious transaction monitoring details</li>
                    <li>Identity verification documents</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">4. PURPOSE OF DATA COLLECTION</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>User registration and authentication</li>
                <li>Issuance and management of digital tokens</li>
                <li>Processing transactions and donations</li>
                <li>Preventing fraud and unauthorized access</li>
                <li>Compliance with Indian laws and regulations</li>
                <li>Internal accounting and audit purposes</li>
                <li>Customer support and grievance handling</li>
                <li>Improving system performance and security</li>
                <li>Maintaining transaction transparency</li>
                <li>Preventing money laundering and financial misuse</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">5. LEGAL BASIS FOR PROCESSING</h2>
              <p className="leading-relaxed">We process personal information based on:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>User consent</li>
                <li>Contractual necessity</li>
                <li>Legal and regulatory obligations</li>
                <li>Legitimate operational interests</li>
                <li>Fraud prevention and security protection</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">6. DATA STORAGE AND SECURITY</h2>
              <p className="leading-relaxed">The Trust implements reasonable security measures to protect user information, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Encrypted databases</li>
                <li>Secure payment gateways</li>
                <li>Restricted administrative access</li>
                <li>Firewall and network security systems</li>
                <li>Multi-factor authentication</li>
                <li>Periodic security audits</li>
                <li>Transaction monitoring systems</li>
              </ul>
              <p className="leading-relaxed text-xs text-gray-500 italic">
                Despite our best efforts, no electronic system is completely secure. Users acknowledge inherent internet and digital transaction risks.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">7. KYC AND AML COMPLIANCE</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Users may be required to complete KYC verification.</li>
                <li>Suspicious or abnormal transactions may be reviewed.</li>
                <li>Transactions violating Indian law may be frozen, investigated, or reported to authorities.</li>
                <li>Anonymous or fraudulent activities are strictly prohibited.</li>
              </ul>
              <p className="leading-relaxed">
                The Trust reserves the right to suspend or terminate accounts involved in unlawful activities.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">8. USE OF COOKIES AND TRACKING TECHNOLOGIES</h2>
              <p className="leading-relaxed">Our website and applications may use cookies and analytics tools to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Improve user experience</li>
                <li>Remember login sessions</li>
                <li>Analyze system performance</li>
                <li>Detect fraud and abuse</li>
                <li>Improve service reliability</li>
              </ul>
              <p className="leading-relaxed">
                Users may disable cookies through browser settings, though some services may not function properly.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">9. DATA SHARING AND DISCLOSURE</h2>
              <p className="leading-relaxed">We do not sell personal information. However, information may be shared with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Government or regulatory authorities when legally required</li>
                <li>Payment gateway providers</li>
                <li>Banking partners</li>
                <li>Technology service providers</li>
                <li>Auditors and compliance professionals</li>
                <li>Law enforcement agencies under lawful requests</li>
              </ul>
              <p className="leading-relaxed">
                All third-party service providers are expected to maintain confidentiality and security standards.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">10. DATA RETENTION</h2>
              <p className="leading-relaxed">We retain personal and transaction data only for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Legal compliance requirements</li>
                <li>Financial audit purposes</li>
                <li>Security investigations</li>
                <li>Operational continuity</li>
                <li>Record maintenance obligations</li>
              </ul>
              <p className="leading-relaxed">
                Data may be retained for periods required under applicable Indian laws.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">11. USER RIGHTS</h2>
              <p className="leading-relaxed">Users may have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access their personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion where legally permissible</li>
                <li>Withdraw consent</li>
                <li>Request transaction history</li>
                <li>Report misuse or unauthorized activity</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">12. CHILDREN’S PRIVACY</h2>
              <p className="leading-relaxed">
                Our services are not intended for individuals under 18 years of age without parental or guardian supervision. The Trust does not knowingly collect personal data from minors without proper authorization.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">13. INTERNATIONAL DATA TRANSFERS</h2>
              <p className="leading-relaxed">
                Where digital infrastructure or service providers are located outside India, user data may be processed internationally subject to applicable safeguards and Indian legal requirements.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">14. FRAUD PREVENTION AND SECURITY MONITORING</h2>
              <p className="leading-relaxed">The Trust reserves the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Monitor suspicious transactions</li>
                <li>Restrict high-risk activities</li>
                <li>Block unauthorized wallets</li>
                <li>Suspend fraudulent accounts</li>
                <li>Investigate misuse of digital tokens</li>
              </ul>
              <p className="leading-relaxed">
                Any attempt to manipulate, counterfeit, duplicate, or illegally trade Trust-issued virtual currency may result in legal action.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">15. LIMITATION OF LIABILITY</h2>
              <p className="leading-relaxed">The Trust shall not be liable for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>User negligence</li>
                <li>Sharing of passwords or OTPs</li>
                <li>Third-party hacking incidents beyond reasonable control</li>
                <li>Regulatory changes affecting digital assets</li>
                <li>Service interruptions due to technical maintenance or force majeure events</li>
              </ul>
              <p className="leading-relaxed">
                Users are responsible for maintaining the confidentiality of their credentials.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">16. POLICY UPDATES</h2>
              <p className="leading-relaxed">This Privacy Policy may be updated periodically to reflect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Legal changes</li>
                <li>RBI or government advisory updates</li>
                <li>Technology upgrades</li>
                <li>Operational improvements</li>
              </ul>
              <p className="leading-relaxed">
                Updated versions shall be published on the official website or application.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">17. GOVERNING LAW</h2>
              <p className="leading-relaxed">
                This Privacy Policy shall be governed by the laws of India. Any disputes arising under this policy shall fall under the jurisdiction of competent courts in Karnataka, India.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900">18. CONTACT INFORMATION</h2>
              <p className="leading-relaxed">
                For privacy concerns, grievance redressal, or compliance-related queries, contact:
              </p>
              <div className="mt-3 font-semibold space-y-1.5 text-gray-800">
                <p className="text-md text-orange-700">SANATHANA VEERASHAIVA LINGAYATHA TRUST</p>
                <p>📍 Address: [Insert Office Address]</p>
                <p>📞 Phone: +919480111889</p>
                <p>✉️ Email: [Insert Email Address]</p>
                <p>🌐 Website: [Insert Website]</p>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">19. USER CONSENT</h2>
              <p className="leading-relaxed">
                By using the Trust’s virtual currency, website, wallet system, or digital services, users acknowledge that they have:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Read this Privacy Policy</li>
                <li>Understood the associated risks</li>
                <li>Agreed to the collection and processing of data</li>
                <li>Accepted the terms and compliance obligations mentioned herein</li>
              </ul>
            </section>
          </article>
        )}

        {lang === "kn" && (
          <article className="prose max-w-none text-gray-700 space-y-6">
            <header className="border-b border-gray-100 pb-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                ಗೌಪ್ಯತಾ ನೀತಿ
              </h1>
              <p className="text-md font-bold text-orange-600 mt-2">
                ಸನಾತನ ವೀರಶೈವ ಲಿಂಗಾಯತ ಟ್ರಸ್ಟ್ – ವರ್ಚುವಲ್ ಕರೆನ್ಸಿ / ಡಿಜಿಟಲ್ ಟೋಕನ್ ವ್ಯವಸ್ಥೆ
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
                <span><strong>ಜಾರಿಗೆ ಬರುವ ದಿನಾಂಕ:</strong> May 28, 2026</span>
                <span>•</span>
                <span><strong>ಆವೃತ್ತಿ:</strong> 1.0</span>
              </div>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧. ಪರಿಚಯ</h2>
              <p className="leading-relaxed">
                ಸನಾತನ ವೀರಶೈವ ಲಿಂಗಾಯತ ಟ್ರಸ್ಟ್ (&quot;ಟ್ರಸ್ಟ್&quot;, &quot;ನಾవు&quot;, &quot;ನಮ್ಮ&quot;) ನಮ್ಮ ವರ್ಚುವಲ್ ಕರೆನ್ಸಿ / ಡಿಜಿಟಲ್ ಟೋಕನ್ ವ್ಯವಸ್ಥೆಯನ್ನು ಬಳಸುವ ಎಲ್ಲಾ ಸದಸ್ಯರು, ದಾನಿಗಳು, ಬಳಕೆದಾರರು ಮತ್ತು ಭಾಗವಹಿಸುವವರ ಗೌಪ್ಯತೆ ಮತ್ತು ಮಾಹಿತಿಯ ಭದ್ರತೆಯನ್ನು ಗೌರವಿಸುತ್ತದೆ.
              </p>
              <p className="leading-relaxed">
                ಈ ಗೌಪ್ಯತಾ ನೀತಿ ಕೆಳಗಿನ ಸೇವೆಗಳೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ನಾವು ಹೇಗೆ ಸಂಗ್ರಹಿಸುತ್ತೇವೆ, ಬಳಸುತ್ತೇವೆ, ಸಂಗ್ರಹಿಸಿಡುತ್ತೇವೆ ಮತ್ತು ರಕ್ಷಿಸುತ್ತೇವೆ ಎಂಬುದನ್ನು ವಿವರಿಸುತ್ತದೆ:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಟ್ರಸ್ಟ್ ನೀಡುವ ಡಿಜಿಟಲ್ ಟೋಕನ್ / ವರ್ಚುವಲ್ ಕರೆನ್ಸಿ</li>
                <li>ಸದಸ್ಯತ್ವ ವ್ಯವಹಾರಗಳು</li>
                <li>ದೇಣಿಗೆ ಮತ್ತು ಕೊಡುಗೆ ದಾಖಲೆಗಳು</li>
                <li>ವಾಲೆಟ್ ನೋಂದಣಿ ಮತ್ತು ಪರಿಶೀಲನೆ</li>
                <li>ಡಿಜಿಟಲ್ ಪಾವತಿ ಸೇವೆಗಳು</li>
                <li>ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ವೆಬ್ಸೈಟ್ ಸೇವೆಗಳು</li>
                <li>ಸಮುದಾಯ ಮತ್ತು ಕಾರ್ಯಕ್ರಮ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆಗಳು</li>
              </ul>
              <p className="leading-relaxed">
                ಈ ನೀತಿ ಕೆಳಗಿನ ಭಾರತೀಯ ಕಾನೂನುಗಳು ಮತ್ತು ನಿಯಮಾವಳಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ರೂಪಿಸಲಾಗಿದೆ:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ (RBI) ಮಾರ್ಗಸೂಚಿಗಳು</li>
                <li>ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯಿದೆ, 2000</li>
                <li>ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯಿದೆ, 2023</li>
                <li>ಹಣ ಸುಧಾರಣೆ ತಡೆ (AML) ನಿಯಮಗಳು</li>
                <li>ಅಗತ್ಯವಿದ್ದಲ್ಲಿ KYC ನಿಯಮಗಳು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-red-50/50 border border-red-100 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-red-900">೨. ಪ್ರಮುಖ ನಿಯಂತ್ರಣಾತ್ಮಕ ಘೋಷಣೆ</h2>
              <p className="leading-relaxed text-red-800">
                ಟ್ರಸ್ಟ್ನ ವರ್ಚುವಲ್ ಕರೆನ್ಸಿ / ಡಿಜಿಟಲ್ ಟೋಕನ್:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-red-800">
                <li>ಭಾರತದಲ್ಲಿ ಕಾನೂನುಬದ್ಧ ನಾಣ್ಯವಲ್ಲ.</li>
                <li>ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ ವತಿಯಿಂದ ನೀಡಲ್ಪಟ್ಟದ್ದಾಗಿಯೂ ಅಥವಾ ಖಾತರಿಪಡಿಸಲ್ಪಟ್ಟದ್ದಾಗಿಯೂ ಇರುವುದಿಲ್ಲ.</li>
                <li>ಅಧಿಕೃತ ಭಾರತೀಯ ಕರೆನ್ಸಿಯಾಗಿ ಪ್ರದರ್ಶಿಸಲಾಗುವುದಿಲ್ಲ.</li>
                <li>ಟ್ರಸ್ಟ್ ಅನುಮೋದಿತ ಸೇವೆಗಳು, ಸದಸ್ಯತ್ವ ವ್ಯವಸ್ಥೆಗಳು ಮತ್ತು ದೇಣಿಗೆ ಚಟುವಟಿಕೆಗಳೊಳಗೆ ಮಾತ್ರ ಬಳಸಬೇಕು.</li>
                <li>ಅನ್ವಯಿಸುವ ಭಾರತೀಯ ಕಾನೂನುಗಳಿಗೆ ಅನುಗುಣವಾಗಿರಬೇಕು.</li>
              </ul>
              <p className="leading-relaxed text-xs text-red-700 italic">
                ಭಾರತದಲ್ಲಿ ಡಿಜಿಟಲ್ ಆಸ್ತಿ ಮತ್ತು ವರ್ಚುವಲ್ ಕರೆನ್ಸಿ ಸಂಬಂಧಿತ ನಿಯಮಗಳು ಕಾಲಾನುಗುಣವಾಗಿ ಬದಲಾಗಬಹುದು.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೩. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ</h2>
              <p className="leading-relaxed">ನಾವು ಮಾಹಿತಿಯ ಕೆಳಗಿನ ವರ್ಗಗಳನ್ನು ಸಂಗ್ರಹಿಸುತ್ತೇವೆ:</p>

              <div className="space-y-3 pl-2">
                <div>
                  <h3 className="font-semibold text-gray-950">A. ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>ಪೂರ್ಣ ಹೆಸರು</li>
                    <li>ಜನ್ಮ ದಿನಾಂಕ</li>
                    <li>ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</li>
                    <li>ಇಮೇಲ್ ವಿಳಾಸ</li>
                    <li>ನಿವಾಸ ವಿಳಾಸ</li>
                    <li>ಸರ್ಕಾರ ಮಾನ್ಯತೆ ಪಡೆದ ಗುರುತಿನ ದಾಖಲೆಗಳು</li>
                    <li>ಸದಸ್ಯತ್ವ ವಿವರಗಳು</li>
                    <li>ಪಾಸ್ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">B. ಹಣಕಾಸು ಮತ್ತು ವ್ಯವಹಾರ ಮಾಹಿತಿ</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>ವಾಲೆಟ್ ಸಂಖ್ಯೆ</li>
                    <li>ವ್ಯವಹಾರ ಇತಿಹಾಸ</li>
                    <li>ಟೋಕನ್ ಖರೀದಿ ಮತ್ತು ವಿನಿಮಯ ದಾಖಲೆಗಳು</li>
                    <li>ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು</li>
                    <li>UPI ಅಥವಾ ಪಾವತಿ ವಿವರಗಳು</li>
                    <li>ದೇಣಿಗೆ ದಾಖಲೆಗಳು</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">C. ತಾಂತ್ರಿಕ ಮಾಹಿತಿ</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IP ವಿಳಾಸ</li>
                    <li>ಸಾಧನ ಮಾಹಿತಿ</li>
                    <li>ಬ್ರೌಸರ್ ಪ್ರಕಾರ</li>
                    <li>ಕಾರ್ಯಾಚರಣಾ ವ್ಯವಸ್ಥೆ</li>
                    <li>ಲಾಗಿನ್ ಸಮಯದ ವಿವರಗಳು</li>
                    <li>ಭದ್ರತಾ ದಾಖಲೆಗಳು</li>
                    <li>ಅಪ್ಲಿಕೇಶನ್ ಬಳಕೆ ಮಾಹಿತಿ</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">D. ನಿಯಂತ್ರಣಾತ್ಮಕ ಮಾಹಿತಿ</h3>
                  <p className="leading-relaxed text-sm mb-1">AML ಮತ್ತು RBI ಸಂಬಂಧಿತ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣವಾಗಿ, ನಾವು ಕೆಳಗಿನದನ್ನು ಸಂಗ್ರಹಿಸಬಹುದು:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>KYC ದಾಖಲೆಗಳು</li>
                    <li>ಅಪಾಯ ಮೌಲ್ಯಮಾపನ ಮಾಹಿತಿ</li>
                    <li>ಅನುಮಾನಾಸ್ಪದ ವ್ಯವಹಾರಗಳ ಪರಿಶೀಲನೆ</li>
                    <li>ಗುರುತಿನ ಪರಿಶೀಲನೆ ದಾಖಲೆಗಳು</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೪. ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವ ಉದ್ದೇಶ</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಬಳಕೆದಾರ ನೋಂದಣಿ ಮತ್ತು ದೃಢೀಕರಣ</li>
                <li>ಡಿಜಿಟಲ್ ಟೋಕನ್ ನಿರ್ವಹಣೆ</li>
                <li>ವ್ಯವಹಾರ ಮತ್ತು ದೇಣಿಗೆ ಪ್ರಕ್ರಿಯೆಗಳು</li>
                <li>ಮೋಸ ಮತ್ತು ಅನಧಿಕೃತ ಪ್ರವೇಶ ತಡೆ</li>
                <li>ಭಾರತೀಯ ಕಾನೂನುಗಳಿಗೆ ಅನುಗುణತೆ</li>
                <li>ಲೆಕ್ಕಪತ್ರ ಮತ್ತು ಆಡಿಟ್ ಉದ್ದೇಶಗಳು</li>
                <li>ಗ್ರಾಹಕ ಸಹಾಯ ಮತ್ತು ದೂರು ಪರಿಹಾರ</li>
                <li>ವ್ಯವಸ್ಥೆಯ ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಭದ್ರತೆ ಸುಧಾರಣೆ</li>
                <li>ಹಣ ಸುಧಾರಣೆ ಮತ್ತು ದುರುಪयोग ತಡೆ</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೫. ಮಾಹಿತಿಯ ಪ್ರಕ್ರಿಯೆಯ ಕಾನೂನು ಆಧಾರ</h2>
              <p className="leading-relaxed">ನಾವು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕೆಳಗಿನ ಆಧಾರಗಳ ಮೇಲೆ ಬಳಸುತ್ತೇವೆ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಬಳಕೆದಾರರ ಅನುಮತಿ</li>
                <li>ಒಪ್ಪಂದದ ಅಗತ್ಯತೆ</li>
                <li>ಕಾನೂನು ಮತ್ತು ನಿಯಂತ್ರಣಾತ್ಮಕ ಬಾಧ್ಯತೆಗಳು</li>
                <li>ಭದ್ರತೆ ಮತ್ತು ಮೋಸ ತಡೆ ಉದ್ದೇಶಗಳು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೬. ಡೇಟಾ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಭದ್ರತೆ</h2>
              <p className="leading-relaxed">ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ರಕ್ಷಿಸಲು ನಾವು ಸಮಂಜಸವಾದ ಭದ್ರತಾ ಕ್ರಮಗಳನ್ನು ಅನುಸರಿಸುತ್ತೇವೆ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಎನ್ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಡೇಟಾಬೇಸ್ಗಳು</li>
                <li>ಸುರಕ್ಷಿತ ಪಾವತಿ ವ್ಯವಸ್ಥೆಗಳು</li>
                <li>ನಿಯಂತ್ರಿತ ಆಡಳಿತ ಪ್ರವೇಶ</li>
                <li>ಫೈರ್ವಾಲ್ ಮತ್ತು ನೆಟ್ವರ್ಕ್ ಭದ್ರತೆ</li>
                <li>ಬಹು ಹಂತದ ದೃಢೀಕರಣ</li>
                <li>ನಿಯಮಿತ ಭದ್ರತಾ ಪರಿಶೀಲನೆಗಳು</li>
                <li>ವ್ಯವಹಾರ ನಿಗಾ ವ್ಯವಸ್ಥೆಗಳು</li>
              </ul>
              <p className="leading-relaxed text-xs text-gray-500 italic">
                ಯಾವುದೇ ಡಿಜಿಟಲ್ ವ್ಯವಸ್ಥೆ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿರುವುದಿಲ್ಲ ಎಂಬುದನ್ನು ಬಳಕೆದಾರರು ಗಮನಿಸಬೇಕು.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೭. KYC ಮತ್ತು AML ಅನುಗುಣತೆ</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಬಳಕೆದಾರರು KYC ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಬೇಕಾಗಬಹುದು.</li>
                <li>ಅನುಮಾನಾಸ್ಪದ ವ್ಯವಹಾರಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.</li>
                <li>ಕಾನೂನು ಉಲ್ಲಂಘನೆ ಕಂಡುಬಂದಲ್ಲಿ ಖಾತೆಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಬಹುದು.</li>
                <li>ಅನಾಮಧೇಯ ಅಥವಾ ಮೋಸದ ಚಟುವಟಿಕೆಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.</li>
              </ul>
              <p className="leading-relaxed">
                ಟ್ರಸ್ಟ್ಗೆ ಯಾವುದೇ ಖಾತೆಯನ್ನು ಸ್ಥಗಿತಗೊಳಿಸುವ ಅಥವಾ ರದ್ದುಪಡಿಸುವ ಹಕ್ಕು ಇದೆ.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-905">೮. ಕುಕೀಸ್ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ತಂತ್ರಜ್ಞಾನ</h2>
              <p className="leading-relaxed">ನಮ್ಮ ವೆಬ್ಸೈಟ್ ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್ಗಳು ಕುಕೀಸ್ ಬಳಸಬಹುದು:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಬಳಕೆದಾರ ಅನುಭವ ಸುಧಾರಣೆ</li>
                <li>ಲಾಗಿನ್ ಸ್ಮರಣೆ</li>
                <li>ವ್ಯವಸ್ಥೆ ವಿಶ್ಲೇಷಣೆ</li>
                <li>ಮೋಸ ಪತ್ತೆ</li>
                <li>ಸೇವಾ ಸುಧಾರಣೆ</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೯. ಮಾಹಿತಿ ಹಂಚಿಕೆ</h2>
              <p className="leading-relaxed">ನಾವು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ. ಆದರೆ ಕಾನೂನುಬದ್ಧ ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಕೆಳಗಿನವರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಬಹುದು:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಗಳು</li>
                <li>ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಪಾವತಿ ಸೇವಾ ಸಂಸ್ಥೆಗಳು</li>
                <li>ತಾಂತ್ರಿಕ ಸೇವಾ ಪೂರೈಕೆದಾರರು</li>
                <li>ಆಡಿಟರ್ಗಳು ಮತ್ತು ನಿಯಂತ್ರಣ ಸಲಹೆಗಾರರು</li>
                <li>ಕಾನೂನು ಜಾರಿ ಸಂಸ್ಥೆಗಳು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೦. ಡೇಟಾ ಸಂಗ್ರಹಣಾ ಅವಧಿ</h2>
              <p className="leading-relaxed">ನಾವು ಮಾಹಿತಿಯನ್ನು ಕೆಳಗಿನ ಉದ್ದೇಶಗಳಿಗೆ ಅಗತ್ಯವಿರುವ ಅವಧಿಗೆ ಮಾತ್ರ ಸಂಗ್ರಹಿಸುತ್ತೇವೆ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಕಾನೂನು ಅನುಗುಣತೆ</li>
                <li>ಹಣಕಾಸು ಆಡಿಟ್</li>
                <li>ಭದ್ರತಾ ತನಿಖೆಗಳು</li>
                <li>ದಾಖಲೆ ನಿರ್ವಹಣೆ</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೧. ಬಳಕೆದಾರರ ಹಕ್ಕುಗಳು</h2>
              <p className="leading-relaxed">ಬಳಕೆದಾರರಿಗೆ ಕೆಳಗಿನ ಹಕ್ಕುಗಳಿರಬಹುದು:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ವೀಕ್ಷಿಸುವುದು</li>
                <li>ತಪ್ಪು ಮಾಹಿತಿಯನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡುವುದು</li>
                <li>ಕಾನೂನುಬದ್ಧವಾಗಿ ಅಳಿಸುವಂತೆ ವಿನಂತಿಸುವುದು</li>
                <li>ಅನುಮತಿಯನ್ನು ಹಿಂಪಡೆಯುವುದು</li>
                <li>ವ್ಯವಹಾರ ವಿವರಗಳನ್ನು ಪಡೆಯುವುದು</li>
                <li>ದುರುಪಯೋಗವನ್ನು ವರದಿ ಮಾಡುವುದು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೨. ಮಕ್ಕಳ ಗೌಪ್ಯತೆ</h2>
              <p className="leading-relaxed">
                18 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ ವಯಸ್ಸಿನವರು ಪಾಲಕರ ಅನುಮತಿ ಇಲ್ಲದೆ ಸೇವೆಗಳನ್ನು ಬಳಸಬಾರದು.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೩. ಅಂತರರಾಷ್ಟ್ರೀಯ ಡೇಟಾ ವರ್ಗಾವಣೆ</h2>
              <p className="leading-relaxed">
                ಕೆಲವು ತಾಂತ್ರಿಕ ಸೇವೆಗಳು ಭಾರತ ಹೊರಗಿರುವ ಸರ್ವರ್ಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸಬಹುದು. ಅಂತಹ ಸಂದರ್ಭಗಳಲ್ಲಿ ಅನ್ವयಿಸುವ ಭಾರತೀಯ ಕಾನೂನುಗಳ ಪ್ರಕಾರ ಸುರಕ್ಷತಾ ಕ್ರಮಗಳನ್ನು ಅನುಸರಿಸಲಾಗುತ್ತದೆ.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೪. ಮೋಸ ತಡೆ ಮತ್ತು ಭದ್ರತಾ ನಿಗಾ</h2>
              <p className="leading-relaxed">ಟ್ರಸ್ಟ್ಗೆ ಕೆಳಗಿನ ಹಕ್ಕುಗಳಿವೆ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಅನುಮಾನಾಸ್ಪದ ವ್ಯವಹಾರಗಳನ್ನು ನಿಗಾ ಮಾಡುವುದು</li>
                <li>ಅನಧಿಕೃತ ವಾಲೆಟ್ಗಳನ್ನು ತಡೆಹಿಡಿಯುವುದು</li>
                <li>ಮೋಸದ ಖಾತೆಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸುವುದು</li>
                <li>ಕಾನೂನು ಕ್ರಮ ಕೈಗೊಳ್ಳುವುದು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೫. ಜವಾಬ್ದಾರಿಯ ಮಿತಿ</h2>
              <p className="leading-relaxed">ಕೆಳಗಿನ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ ಟ್ರಸ್ಟ್ ಹೊಣೆಗಾರಿಯಾಗುವುದಿಲ್ಲ:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಬಳಕೆದಾರರ ನಿರ್ಲಕ್ಷ್ಯ</li>
                <li>OTP ಅಥವಾ ಪಾಸ್ವರ್ಡ್ ಹಂಚಿಕೆ</li>
                <li>ಹ್ಯಾಕಿಂಗ್ ಘಟನೆಗಳು</li>
                <li>ನಿಯಂತ್ರಣಾತ್ಮಕ ಬದಲಾವಣೆಗಳು</li>
                <li>ತಾಂತ್ರಿక ದೋಷಗಳು ಅಥವಾ ಸೇವಾ ವ್ಯತ್ಯयಗಳು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೬. ನೀತಿ ನವೀಕರಣಗಳು</h2>
              <p className="leading-relaxed">ಈ ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಸಮಯಾನುಗುಣವಾಗಿ ನವೀಕರಿಸಬಹುದು:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಕಾನೂನು ಬದಲಾವಣೆಗಳು</li>
                <li>RBI ಮಾರ್ಗಸೂಚಿ ಬದಲಾವಣೆ</li>
                <li>ತಾಂತ್ರಿಕ ಸುಧಾರಣೆಗಳು</li>
                <li>ಕಾರ್ಯಾಚರಣಾ ಅವಶ್ಯಕತೆಗಳು</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೭. ಅನ್ವಯಿಸುವ ಕಾನೂನು</h2>
              <p className="leading-relaxed">
                ಈ ಗೌಪ್ಯತಾ ನೀತಿ ಭಾರತೀಯ ಕಾನೂನುಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ. ಯಾವುದೇ ವಿವಾದಗಳಿಗೆ ಕರ್ನಾಟಕ ನ್ಯಾಯಾಲಯಗಳ ಅಧಿಕಾರ ಅನ್ವಯಿಸುತ್ತದೆ.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900">೧೮. ಸಂಪರ್ಕ ಮಾಹಿತಿ</h2>
              <p className="leading-relaxed">
                ಗೌಪ್ಯತೆ ಅಥವಾ ದೂರು ಸಂಬಂಧಿತ ವಿಚಾರಗಳಿಗೆ ಸಂಪರ್ಕಿಸಿ:
              </p>
              <div className="mt-3 font-semibold space-y-1.5 text-gray-800">
                <p className="text-md text-orange-700">ಸನಾತನ ವೀರಶೈವ ಲಿಂಗಾಯತ ಟ್ರಸ್ಟ್</p>
                <p>📍 ಕಚೇರಿ ವಿಳಾಸ: [ಕಚೇರಿ ವಿಳಾಸ]</p>
                <p>📞 ಮೊಬೈಲ್ ಸಂಖ್ಯೆ: +919480111889</p>
                <p>✉️ ಇಮೇಲ್ ವಿಳಾಸ: [ಇಮೇಲ್ ವಿಳಾಸ]</p>
                <p>🌐 ವೆಬ್ಸೈಟ್: [ವೆಬ್ಸೈಟ್]</p>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">೧೯. ಬಳಕೆದಾರರ ಒಪ್ಪಿಗೆ</h2>
              <p className="leading-relaxed">
                ಟ್ರಸ್ಟ್ನ ವರ್ಚುವಲ್ ಕರೆನ್ಸಿ ಅಥವಾ ಡಿಜಿಟಲ್ ಸೇವೆಗಳನ್ನು ಬಳಸುವ ಮೂಲಕ ಬಳಕೆದಾರರು:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ಈ ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಓದಿದ್ದಾರೆ</li>
                <li>ಸಂಬಂಧಿತ ಅಪಾಯಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದಾರೆ</li>
                <li>ಮಾಹಿತಿಯ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಬಳಕೆಗೆ ಒಪ್ಪಿದ್ದಾರೆ</li>
                <li>ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳನ್ನು ಅಂಗೀಕರಿಸಿದ್ದಾರೆ</li>
              </ul>
            </section>
          </article>
        )}

        {lang === "te" && (
          <article className="prose max-w-none text-gray-700 space-y-6">
            <header className="border-b border-gray-100 pb-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                గోప్యతా విధానం
              </h1>
              <p className="text-md font-bold text-orange-600 mt-2">
                సనాతన వీరశైవ లింగాయత ట్రస్ట్ – వర్చువల్ కరెన్సీ / డిజిటల్ టోకెన్ వ్యవస్థ
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
                <span><strong>అమల్లోకి వచ్చే తేదీ:</strong> May 28, 2026</span>
                <span>•</span>
                <span><strong>వెర్షన్:</strong> 1.0</span>
              </div>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">1. పరిచయం</h2>
              <p className="leading-relaxed">
                సనాతన వీరశైవ లింగాయత ట్రస్ట్ (&quot;ట్రస్ట్&quot;, &quot;మేము&quot;, &quot;మా&quot;) మా వర్చువల్ కరెన్సీ / డిజిటల్ టోకెన్ వ్యవస్థను ఉపయోగించే సభ్యులు, దాతలు, వినియోగదారులు మరియు పాల్గొనే ప్రతి వ్యక్తి యొక్క గోప్యత మరియు డేటా భద్రతను గౌరవిస్తుంది.
              </p>
              <p className="leading-relaxed">
                ఈ గోప్యతా విధానం కింది సేవలకు సంబంధించి మేము వ్యక్తిగత సమాచారాన్ని ఎలా సేకరిస్తాము, ఉపయోగిస్తాము, నిల్వ చేస్తాము మరియు రక్షిస్తాము అనే విషయాన్ని వివరిస్తుంది:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ట్రస్ట్ జారీ చేసే డిజిటల్ టోకెన్లు / వర్చువల్ కరెన్సీ</li>
                <li>సభ్యత్వ లావాదేవీలు</li>
                <li>విరాళాలు మరియు సహాయ నిధుల రికార్డులు</li>
                <li>వాలెట్ నమోదు మరియు ధృవీకరణ</li>
                <li>డిజిటల్ చెల్లింపు సేవలు</li>
                <li>మొబైల్ అప్లికేషన్ మరియు వెబ్సైట్ సేవలు</li>
                <li>కమ్యూనిటీ మరియు కార్యక్రమ నిర్వహణ వ్యవస్థలు</li>
              </ul>
              <p className="leading-relaxed">
                ఈ విధానం క్రింది భారతీయ చట్టాలు మరియు నియంత్రణలకు అనుగుణంగా రూపొందించబడింది:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా (RBI) మార్గదర్శకాలు</li>
                <li>సమాచార సాంకేతిక చట్టం, 2000</li>
                <li>డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం, 2023</li>
                <li>యాంటీ మనీ లాండరింగ్ (AML) నిబంధనలు</li>
                <li>అవసరమైన చోట KYC నిబంధనలు</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-red-50/50 border border-red-100 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-red-900">2. ముఖ్యమైన నియంత్రణ ప్రకటన</h2>
              <p className="leading-relaxed text-red-800">
                ట్రస్ట్ యొక్క వర్చువల్ కరెన్సీ / డిజిటల్ టోకెన్:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-red-800">
                <li>భారతదేశంలో చట్టబద్ధ కరెన్సీ కాదు.</li>
                <li>రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా ద్వారా జారీ చేయబడినది లేదా హామీ ఇవ్వబడినది కాదు.</li>
                <li>అధికారిక భారతీయ కరెన్సీగా ప్రదర్శించబడదు.</li>
                <li>ట్రస్ట్ ఆమోదించిన సేవలు, సభ్యత్వ వ్యవస్థలు మరియు విరాళ కార్యకలాపాల పరిధిలో మాత్రమే ఉపయోగించాలి.</li>
                <li>భారతదేశంలో అమలులో ఉన్న చట్టాలకు అనుగుణంగా ఉండాలి.</li>
              </ul>
              <p className="leading-relaxed text-xs text-red-700 italic">
                భారతదేశంలో డిజిటల్ ఆస్తులు మరియు వర్చువల్ కరెన్సీలకు సంబంధించిన నియమాలు కాలానుగుణంగా మారవచ్చు.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">3. మేము సేకరించే సమాచారం</h2>
              <p className="leading-relaxed">మేము సమాచారాన్ని కింది వర్గాలలో సేకరించవచ్చు:</p>

              <div className="space-y-3 pl-2">
                <div>
                  <h3 className="font-semibold text-gray-950">A. వ్యక్తిగత సమాచారం</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>పూర్తి పేరు</li>
                    <li>జనన తేదీ</li>
                    <li>మొబైల్ నంబర్</li>
                    <li>ఇమెయిల్ చిరునామా</li>
                    <li>నివాస చిరునామా</li>
                    <li>ప్రభుత్వ గుర్తింపు పత్రాలు</li>
                    <li>సభ్యత్వ వివరాలు</li>
                    <li>పాస్పోర్ట్ సైజ్ ఫోటో</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-955">B. ఆర్థిక మరియు లావాదేవీ సమాచారం</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>వాలెట్ నంబర్</li>
                    <li>లావాదేవీ చరిత్ర</li>
                    <li>టోకెన్ కొనుగోలు మరియు మార్పిడి రికార్డులు</li>
                    <li>బ్యాంక్ ఖాతా వివరాలు</li>
                    <li>UPI లేదా చెల్లింపు వివరాలు</li>
                    <li>విరాళాల రికార్డులు</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">C. సాంకేతిక సమాచారం</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IP చిరునామా</li>
                    <li>పరికర సమాచారం</li>
                    <li>బ్రౌజర్ రకం</li>
                    <li>ఆపరేటింగ్ సిస్టమ్</li>
                    <li>లాగిన్ సమయ వివరాలు</li>
                    <li>భద్రతా రికార్డులు</li>
                    <li>అప్లికేషన్ వినియోగ సమాచారం</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">D. నియంత్రణ సంబంధిత సమాచారం</h3>
                  <p className="leading-relaxed text-sm mb-1">AML మరియు RBI సంబంధిత నిబంధనలకు అనుగుణంగా, మేము సేకరించవచ్చు:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>KYC రికార్డులు</li>
                    <li>రిస్క్ అంచనా సమాచారం</li>
                    <li>అనుమానాస్పద లావాదేవీల పర్యవేక్షణ</li>
                    <li>గుర్తింపు ధృవీకరణ పత్రాలు</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">4. సమాచార సేకరణ ఉద్దేశ్యం</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>వినియోగదారుల నమోదు మరియు ధృవీకరణ</li>
                <li>డిజిటల్ టోకెన్ నిర్వహణ</li>
                <li>లావాదేవీలు మరియు విరాళాల ప్రాసెసింగ్</li>
                <li>మోసం మరియు అనధికార ప్రవేశ నిరోధం</li>
                <li>భారతీయ చట్టాలకు అనుగుణత</li>
                <li>లెక్కలు మరియు ఆడిట్ అవసరాలు</li>
                <li>వినియోగదారుల సహాయం మరియు ఫిర్యాదు పరిష్కారం</li>
                <li>వ్యవస్థ భద్రత మరియు పనితీరు మెరుగుదల</li>
                <li>మనీ లాండరింగ్ మరియు దుర్వినియోగ నివారణ</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">5. సమాచార ప్రాసెసింగ్కు చట్టబద్ధ ఆధారం</h2>
              <p className="leading-relaxed">మేము వ్యక్తిగత సమాచారాన్ని కింది ఆధారాలపై ప్రాసెస్ చేస్తాము:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>వినియోగదారుల సమ్మతి</li>
                <li>ఒప్పంద అవసరం</li>
                <li>చట్టపరమైన మరియు నియంత్రణ బాధ్యతలు</li>
                <li>భద్రత మరియు మోసం నిరోధక అవసరాలు</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">6. డేటా నిల్వ మరియు భద్రత</h2>
              <p className="leading-relaxed">మీ సమాచారాన్ని రక్షించడానికి మేము తగిన భద్రతా చర్యలను అమలు చేస్తాము:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ఎన్క్రిప్ట్ చేసిన డేటాబేస్లు</li>
                <li>సురక్షిత చెల్లింపు వ్యవస్థలు</li>
                <li>పరిమిత పరిపాలనా యాక్సెస్</li>
                <li>ఫైర్వాల్ మరియు నెట్వర్క్ భద్రత</li>
                <li>బహుళ స్థాయి ధృవీకరణ</li>
                <li>నియమిత భద్రతా తనిఖీలు</li>
                <li>లావాదేవీ పర్యవేక్షణ వ్యవస్థలు</li>
              </ul>
              <p className="leading-relaxed text-xs text-gray-500 italic">
                ఏ డిజిటల్ వ్యవస్థ పూర్తిగా సురక్షితమని హామీ ఇవ్వలేమని వినియోగదారులు అంగీకరిస్తారు.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">7. KYC మరియు AML అనుసరణ</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>వినియోగదారులు KYC ధృవీకరణ పూర్తి చేయవలసి రావచ్చు.</li>
                <li>అనుమానాస్పద లావాదేవీలను సమీక్షించవచ్చు.</li>
                <li>చట్ట ఉల్లంఘనల సందర్భంలో ఖాతాలను నిలిపివేయవచ్చు.</li>
                <li>అనామక లేదా మోసపూరిత కార్యకలాపాలు ఖచ్చితంగా నిషేధించబడ్డాయి.</li>
              </ul>
              <p className="leading-relaxed">
                ట్రస్ట్కు ఏ ఖాతానైనా నిలిపివేయడానికి లేదా రద్దు చేయడానికి హక్కు ఉంది.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">8. కుకీలు మరియు ట్రాకింగ్ సాంకేతికతలు</h2>
              <p className="leading-relaxed">మా వెబ్సైట్ మరియు అప్లికేషన్లు కుకీలు ఉపయోగించవచ్చు:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>వినియోగదారుల అనుభవ మెరుగుదల</li>
                <li>లాగిన్ గుర్తింపు</li>
                <li>వ్యవస్థ విశ్లేషణ</li>
                <li>మోసం గుర్తింపు</li>
                <li>సేవల మెరుగుదల</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">9. సమాచార భాగస్వామ్యం</h2>
              <p className="leading-relaxed">మేము మీ వ్యక్తిగత సమాచారాన్ని విక్రయించము. అయితే చట్టబద్ధ అవసరాల మేరకు కింది సంస్థలతో పంచుకోవచ్చు:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ప్రభుత్వ సంస్థలు</li>
                <li>బ్యాంకింగ్ మరియు పావతి సేవా సంస్థలు</li>
                <li>సాంకేతిక సేవా ప్రదాతలు</li>
                <li>ఆడిటర్లు మరియు నియంత్రణ సలహాదారులు</li>
                <li>చట్ట అమలు సంస్థలు</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">10. డేటా నిల్వ కాలం</h2>
              <p className="leading-relaxed">మేము సమాచారాన్ని కింది అవసరాల మేరకు మాత్రమే నిల్వ చేస్తాము:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>చట్టపరమైన అనుసరణ</li>
                <li>ఆర్థిక ఆడిట్</li>
                <li>భద్రతా దర్యాప్తులు</li>
                <li>రికార్డు నిర్వహణ</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">11. వినియోగదారుల హక్కులు</h2>
              <p className="leading-relaxed">వినియోగదారులకు కింది హక్కులు ఉండవచ్చు:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>వ్యక్తిగత సమాచారాన్ని చూడడం</li>
                <li>తప్పు సమాచారాన్ని సవరించడం</li>
                <li>చట్టబద్ధంగా తొలగించమని అభ్యర్థించడం</li>
                <li>సమ్మతిని ఉపసంహరించుకోవడం</li>
                <li>లావాదేవీ చరిత్రను పొందడం</li>
                <li>దుర్వినియోగాన్ని నివేదించడం</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">12. పిల్లల గోప్యత</h2>
              <p className="leading-relaxed">
                18 సంవత్సరాల లోపు వ్యక్తులు తల్లిదండ్రుల లేదా సంరక్షకుల అనుమతి లేకుండా సేవలను ఉపయోగించకూడదు.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">13. అంతర్జాతీయ డేటా బదిలీలు</h2>
              <p className="leading-relaxed">
                కొన్ని సాంకేతిక సేవలు భారతదేశం వెలుపల ఉన్న సర్వర్లలో నిర్వహించబడవచ్చు. అలాంటి సందర్భాల్లో భారతీయ చట్టాలకు అనుగుణమైన భద్రతా చర్యలు తీసుకోబడతాయి.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">14. మోసం నిరోధం మరియు భద్రతా పర్యవేక్షణ</h2>
              <p className="leading-relaxed">ట్రస్ట్కు కింది హక్కులు ఉన్నాయి:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>అనుమానాస్పద లావాదేవీల పర్యవేక్షణ</li>
                <li>అనధికార వాలెట్లను నిరోధించడం</li>
                <li>మోసపూరిత ఖాతాలను నిలిపివేయడం</li>
                <li>చట్టపరమైన చర్యలు తీసుకోవడం</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">15. బాధ్యత పరిమితి</h2>
              <p className="leading-relaxed">క్రింది పరిస్థితుల్లో ట్రస్ట్ బాధ్యత వహించదు:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>వినియోగదారుల నిర్లక్ష్యం</li>
                <li>OTP లేదా పాస్వర్డ్ పంచుకోవడం</li>
                <li>హ్యాకింగ్ సంఘటనలు</li>
                <li>నియంత్రణ మార్పులు</li>
                <li>సాంకేతిక లోపాలు లేదా సేవా అంతరాయాలు</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">16. విధాన నవీకరణలు</h2>
              <p className="leading-relaxed">ఈ గోప్యతా విధానం కాలానుగుణంగా నవీకరించబడవచ్చు:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>చట్ట మార్పులు</li>
                <li>RBI మార్గదర్శకాల మార్పులు</li>
                <li>సాంకేతిక అభివృద్ధులు</li>
                <li>కార్యకలాప అవసరాలు</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">17. అమలులో ఉండే చట్టం</h2>
              <p className="leading-relaxed">
                ఈ గోప్యతా విధానం భారతీయ చట్టాలకు లోబడి ఉంటుంది. ఏవైనా వివాదాలు కర్ణాటక న్యాయస్థానాల పరిధిలో పరిష్కరించబడతాయి.
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900">18. సంప్రదింపు వివరాలు</h2>
              <p className="leading-relaxed">
                గోప్యత లేదా ఫిర్యాదు సంబంధిత విషయాల కోసం సంప్రదించండి:
              </p>
              <div className="mt-3 font-semibold space-y-1.5 text-gray-800">
                <p className="text-md text-orange-700">సనాతన వీరశైవ లింగాయత ట్రస్ట్</p>
                <p>📍 కార్యాలయ చిరునామా: [కార్యాలయ చిరునామా]</p>
                <p>📞 మొబైల్ నంబర్: +919480111889</p>
                <p>✉️ ఇమెయిల్ చిరునామా: [ఇమెయిల్ చిరునామా]</p>
                <p>🌐 వెబ్సైట్: [వెబ్సైట్]</p>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">19. వినియోగదారుల అంగీకారం</h2>
              <p className="leading-relaxed">
                ట్రస్ట్ యొక్క వర్చువల్ కరెన్సీ లేదా డిజిటల్ సేవలను ఉపయోగించడం ద్వారా వినియోగదారులు:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ఈ గోప్యతా విధానాన్ని చదివారు</li>
                <li>సంబంధిత ప్రమాదాలను అర్థం చేసుకున్నారు</li>
                <li>సమాచార సేకరణ మరియు వినియోగానికి అంగీకరించారు</li>
                <li>నిబంధనలు మరియు షరతులను అంగీకరించారు</li>
              </ul>
            </section>
          </article>
        )}

        {lang === "hi" && (
          <article className="prose max-w-none text-gray-700 space-y-6">
            <header className="border-b border-gray-100 pb-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                गोपनीयता नीति
              </h1>
              <p className="text-md font-bold text-orange-600 mt-2">
                सनातन वीरशैव लिंगायत ट्रस्ट – वर्चुअल करेंसी / डिजिटल टोकन प्रणाली
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-4">
                <span><strong>प्रभावी तिथि:</strong> May 28, 2026</span>
                <span>•</span>
                <span><strong>संस्करण:</strong> 1.0</span>
              </div>
            </header>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">1. परिचय</h2>
              <p className="leading-relaxed">
                सनातन वीरशैव लिंगायत ट्रस्ट (&quot;हम&quot;, &quot;हमारा&quot; या &quot;ट्रस्ट&quot;) हमारे वर्चुअल करेंसी / डिजिटल टोकन पारिस्थितिकी तंत्र (इकोसिस्टम) का उपयोग करने वाले सभी सदस्यों, उपयोगकर्ताओं, दानदाताओं और प्रतिभागियों की गोपनीयता और सुरक्षा का सम्मान करता है।
              </p>
              <p className="leading-relaxed">
                यह गोपनीयता नीति बताती है कि हम निम्नलिखित के संबंध में व्यक्तिगत जानकारी को कैसे एकत्र, उपयोग, संग्रहीत, संसाधित और सुरक्षित करते हैं:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ट्रस्ट द्वारा जारी डिजिटल टोकन / वर्चुअल करेंसी</li>
                <li>सदस्यता लेनदेन</li>
                <li>दान और योगदान रिकॉर्ड</li>
                <li>वॉलेट पंजीकरण और सत्यापन</li>
                <li>डिजिटल भुगतान सेवाएं</li>
                <li>मोबाइल एप्लिकेशन और वेबसाइटें</li>
                <li>सामुदायिक और कार्यक्रम भागीदारी प्रणाली</li>
              </ul>
              <p className="leading-relaxed">
                यह नीति निम्नलिखित के संरेखण में डिज़ाइन की गई है:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>डिजिटल भुगतान और वित्तीय अनुपालन पर लागू भारतीय रिजर्व बैंक (RBI) के दिशानिर्देश</li>
                <li>सूचना प्रौद्योगिकी अधिनियम, 2000</li>
                <li>डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 (भारत)</li>
                <li>एंटी-मनी लॉन्ड्रिंग (AML) सिद्धांत</li>
                <li>जहाँ लागू हो, नो योर कस्टमर (KYC) आवश्यकताएं</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-red-50/50 border border-red-100 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-red-900">2. महत्वपूर्ण नियामक घोषणा</h2>
              <p className="leading-relaxed text-red-800">
                ट्रस्ट की वर्चुअल करेंसी / डिजिटल टोकन:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-red-800">
                <li>भारत में वैध मुद्रा (लीगल टेंडर) नहीं है।</li>
                <li>भारतीय रिजर्व बैंक (RBI) द्वारा जारी या गारंटीकृत नहीं है।</li>
                <li>इसे आधिकारिक मुद्रा के रूप में प्रस्तुत नहीं किया जाएगा।</li>
                <li>इसका उपयोग केवल ट्रस्ट के अनुमत पारिस्थितिकी तंत्र, सदस्यता नेटवर्क, दान ढांचे या स्वीकृत सेवाओं के भीतर ही किया जाएगा।</li>
                <li>सभी लागू भारतीय कानूनों और नियामक आवश्यकताओं का पालन करेगा।</li>
              </ul>
              <p className="leading-relaxed text-xs text-red-700 italic">
                उपयोगकर्ताओं को सलाह दी जाती है कि भारत में क्रिप्टोकुरेंसी और डिजिटल संपत्ति नियम समय-समय पर विकसित हो सकते हैं।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">3. जानकारी जो हम एकत्र करते हैं</h2>
              <p className="leading-relaxed">हम जानकारी की निम्नलिखित श्रेणियों को एकत्र कर सकते हैं:</p>

              <div className="space-y-3 pl-2">
                <div>
                  <h3 className="font-semibold text-gray-950">A. व्यक्तिगत जानकारी</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>पूरा नाम</li>
                    <li>जन्म तिथि</li>
                    <li>मोबाइल नंबर</li>
                    <li>ईमेल पता</li>
                    <li>आवासीय पता</li>
                    <li>सरकार द्वारा जारी पहचान दस्तावेज</li>
                    <li>सदस्यता पहचान विवरण</li>
                    <li>पासपोर्ट आकार का फोटो</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-955">B. वित्तीय और लेनदेन संबंधी जानकारी</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>वॉलेट पहचान संख्या</li>
                    <li>लेनदेन का इतिहास</li>
                    <li>टोकन खरीद और मोचन (रिडेम्पशन) रिकॉर्ड</li>
                    <li>बैंक खाते का विवरण (जहाँ लागू हो)</li>
                    <li>UPI या भुगतान लेनदेन संदर्भ</li>
                    <li>दान और योगदान रिकॉर्ड</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-950">C. तकनीकी जानकारी</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IP पता</li>
                    <li>डिजिटल डिवाइस की जानकारी</li>
                    <li>ब्राउज़र प्रकार</li>
                    <li>ऑपरेटिंग सिस्टम</li>
                    <li>लॉगिन टाइमस्टैम्प</li>
                    <li>सुरक्षा लॉग</li>
                    <li>एप्लिकेशन उपयोग डेटा</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-955">D. अनुपालन जानकारी</h3>
                  <p className="leading-relaxed text-sm mb-1">एएमएल, धोखाधड़ी की रोकथाम और आरबीआई-संरेखित प्रथाओं का पालन करने के लिए, हम एकत्र कर सकते हैं:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>KYC सत्यापन रिकॉर्ड</li>
                    <li>जोखिम मूल्यांकन डेटा</li>
                    <li>संदिग्ध लेनदेन निगरानी विवरण</li>
                    <li>पहचान सत्यापन दस्तावेज</li>
                  </ul>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">4. डेटा एकत्र करने का उद्देश्य</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>उपयोगकर्ता पंजीकरण और प्रमाणीकरण</li>
                <li>डिजिटल टोकन जारी करना और प्रबंधन</li>
                <li>लेनदेन और दान प्रसंस्करण</li>
                <li>धोखाधड़ी और अनधिकृत पहुंच को रोकना</li>
                <li>भारतीय कानूनों और नियमों का अनुपालन</li>
                <li>आंतरिक लेखांकन और लेखा परीक्षा (ऑडिट) उद्देश्य</li>
                <li>ग्राहक सहायता और शिकायत निवारण</li>
                <li>सिस्टम प्रदर्शन और सुरक्षा में सुधार</li>
                <li>लेनदेन की पारदर्शिता बनाए रखना</li>
                <li>मनी लॉन्ड्रिंग और वित्तीय दुरुपयोग को रोकना</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">5. प्रसंस्करण के लिए कानूनी आधार</h2>
              <p className="leading-relaxed">हम व्यक्तिगत जानकारी को निम्नलिखित आधारों पर संसाधित करते हैं:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>उपयोगकर्ता की सहमति</li>
                <li>अनुबंधात्मक आवश्यकता</li>
                <li>कानूनी और नियामक दायित्व</li>
                <li>वैध परिचालन हित</li>
                <li>धोखाधड़ी की रोकथाम और सुरक्षा संरक्षण</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">6. डेटा भंडारण और सुरक्षा</h2>
              <p className="leading-relaxed">ट्रस्ट उपयोगकर्ता की जानकारी की सुरक्षा के लिए उचित सुरक्षा उपाय लागू करता है, जिसमें शामिल हैं:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>एन्क्रिप्टेड डेटाबेस</li>
                <li>सुरक्षित भुगतान गेटवे</li>
                <li>प्रतिबंधित प्रशासनिक पहुंच</li>
                <li>फ़ायरवॉल और नेटवर्क सुरक्षा प्रणालियाँ</li>
                <li>बहु-कारक प्रमाणीकरण (Multi-factor authentication)</li>
                <li>आवधिक सुरक्षा ऑडिट</li>
                <li>लेनदेन निगरानी प्रणाली</li>
              </ul>
              <p className="leading-relaxed text-xs text-gray-500 italic">
                हमारे सर्वोत्तम प्रयासों के बावजूद, कोई भी इलेक्ट्रॉनिक सिस्टम पूरी तरह से सुरक्षित नहीं है। उपयोगकर्ता अंतर्निहित इंटरनेट और डिजिटल लेनदेन जोखिमों को स्वीकार करते हैं।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">7. KYC और AML अनुपालन</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>उपयोगकर्ताओं को केवाईसी सत्यापन पूरा करने की आवश्यकता हो सकती है।</li>
                <li>संदिग्ध या असामान्य लेनदेन की समीक्षा की जा सकती है।</li>
                <li>भारतीय कानून का उल्लंघन करने वाले लेनदेन को अधिकारियों को रिपोर्ट किया जा सकता है या फ्रीज/जांच की जा सकती है।</li>
                <li>अनाम या धोखाधड़ी वाली गतिविधियां सख्त वर्जित हैं।</li>
              </ul>
              <p className="leading-relaxed">
                ट्रस्ट गैर-कानूनी गतिविधियों में शामिल खातों को निलंबित या समाप्त करने का अधिकार सुरक्षित रखता है।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">8. कुकीज़ और ट्रैकिंग तकनीकों का उपयोग</h2>
              <p className="leading-relaxed">हमारी वेबसाइट और एप्लिकेशन कुकीज़ और एनालिटिक्स टूल का उपयोग कर सकते हैं:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>उपयोगकर्ता अनुभव में सुधार के लिए</li>
                <li>लॉगिन सत्र याद रखने के लिए</li>
                <li>सिस्टम प्रदर्शन का विश्लेषण करने के लिए</li>
                <li>धोखाधड़ी और दुरुपयोग का पता लगाने के लिए</li>
                <li>सेवा विश्वसनीयता में सुधार के लिए</li>
              </ul>
              <p className="leading-relaxed">
                उपयोगकर्ता ब्राउज़र सेटिंग्स के माध्यम से कुकीज़ को अक्षम कर सकते हैं, हालांकि कुछ सेवाएं ठीक से काम नहीं कर सकती हैं।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">9. डेटा साझाकरण और प्रकटीकरण</h2>
              <p className="leading-relaxed">हम व्यक्तिगत जानकारी नहीं बेचते हैं। हालाँकि, जानकारी निम्नलिखित के साथ साझा की जा सकती है:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>कानूनी रूप से आवश्यक होने पर सरकारी या नियामक अधिकारी</li>
                <li>पेमेंट गेटवे प्रदाता</li>
                <li>बैंकिंग भागीदार</li>
                <li>प्रौद्योगिकी सेवा प्रदाता</li>
                <li>लेखा परीक्षक और अनुपालन पेशेवर</li>
                <li>कानूनी अनुरोधों के तहत कानून प्रवर्तन एजेंसियां</li>
              </ul>
              <p className="leading-relaxed">
                सभी तृतीय-पक्ष सेवा प्रदाताओं से गोपनीयता और सुरक्षा मानकों को बनाए रखने की अपेक्षा की जाती है।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">10. डेटा प्रतिधारण (Data Retention)</h2>
              <p className="leading-relaxed">हम व्यक्तिगत और लेनदेन डेटा को केवल निम्नलिखित के लिए बनाए रखते हैं:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>कानूनी अनुपालन आवश्यकताएं</li>
                <li>वित्तीय ऑडिट उद्देश्य</li>
                <li>सुरक्षा जांच</li>
                <li>परिचालन निरंतरता</li>
                <li>रिकॉर्ड बनाए रखने के दायित्व</li>
              </ul>
              <p className="leading-relaxed">
                डेटा को लागू भारतीय कानूनों के तहत आवश्यक अवधि के लिए बनाए रखा जा सकता है।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">11. उपयोगकर्ता अधिकार</h2>
              <p className="leading-relaxed">उपयोगकर्ताओं को निम्नलिखित अधिकार हो सकते हैं:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>अपनी व्यक्तिगत जानकारी तक पहुँच</li>
                <li>गलत जानकारी को सुधारना</li>
                <li>जहाँ कानूनी रूप से अनुमेय हो, विलोपन (डेटा हटाने) का अनुरोध करना</li>
                <li>सहमति वापस लेना</li>
                <li>लेनदेन इतिहास का अनुरोध करना</li>
                <li>दुरुपयोग या अनधिकृत गतिविधि की रिपोर्ट करना</li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">12. बच्चों की गोपनीयता</h2>
              <p className="leading-relaxed">
                हमारी सेवाएं माता-पिता या अभिभावक की देखरेख के बिना 18 वर्ष से कम आयु के व्यक्तियों के लिए नहीं हैं। ट्रस्ट उचित प्राधिकरण के बिना नाबालिगों से व्यक्तिगत डेटा जानबूझकर एकत्र नहीं करता है।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">13. अंतर्राष्ट्रीय डेटा स्थानांतरण</h2>
              <p className="leading-relaxed">
                जहाँ डिजिटल अवसंरचना या सेवा प्रदाता भारत से बाहर स्थित हैं, वहाँ लागू सुरक्षा उपायों और भारतीय कानूनी आवश्यकताओं के अधीन उपयोगकर्ता डेटा को अंतर्राष्ट्रीय स्तर पर संसाधित किया जा सकता है।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">14. धोखाधड़ी की रोकथाम और सुरक्षा निगरानी</h2>
              <p className="leading-relaxed">ट्रस्ट के पास निम्नलिखित अधिकार सुरक्षित हैं:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>संदिग्ध लेन-देन की निगरानी करना</li>
                <li>उच्च जोखिम वाली गतिविधियों को प्रतिबंधित करना</li>
                <li>अनधिकृत वॉलेट को ब्लॉक करना</li>
                <li>धोखाधड़ी वाले खातों को निलंबित करना</li>
                <li>डिजिटल टोकन के दुरुपयोग की जांच करना</li>
              </ul>
              <p className="leading-relaxed">
                ट्रस्ट द्वारा जारी वर्चुअल करेंसी में हेरफेर करने, जाली बनाने, डुप्लिकेट करने या अवैध रूप से व्यापार करने का कोई भी प्रयास कानूनी कार्रवाई का कारण बन सकता है।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">15. दायित्व की सीमा</h2>
              <p className="leading-relaxed">ट्रस्ट निम्नलिखित के लिए उत्तरदायी नहीं होगा:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>उपयोगकर्ता की लापरवाही</li>
                <li>पासवर्ड या ओटीपी साझा करना</li>
                <li>उचित नियंत्रण से परे तृतीय-पक्ष हैकिंग की घटनाएं</li>
                <li>डिजिटल संपत्तियों को प्रभावित करने वाले नियामक बदलाव</li>
                <li>तकनीकी रखरखाव या अप्रत्याशित (force majeure) घटनाओं के कारण सेवा में व्यवधान</li>
              </ul>
              <p className="leading-relaxed">
                उपयोगकर्ता अपने क्रेडेंशियल्स की गोपनीयता बनाए रखने के लिए स्वयं जिम्मेदार हैं।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">16. नीति अपडेट</h2>
              <p className="leading-relaxed">इस गोपनीयता नीति को समय-समय पर अपडेट किया जा सकता है ताकि निम्नलिखित को दर्शाया जा सके:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>कानूनी बदलाव</li>
                <li>आरबीआई या सरकारी दिशानिर्देश अपडेट</li>
                <li>तकनीकी अपग्रेड</li>
                <li>परिचालन सुधार</li>
              </ul>
              <p className="leading-relaxed">
                अपडेट किए गए संस्करण आधिकारिक वेबसाइट या एप्लिकेशन पर प्रकाशित किए जाएंगे।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">17. शासी कानून</h2>
              <p className="leading-relaxed">
                यह गोपनीयता नीति भारत के कानूनों द्वारा शासित होगी। इस नीति के तहत उत्पन्न होने वाले किसी भी विवाद का निपटारा कर्नाटक, भारत में सक्षम न्यायालयों के क्षेत्राधिकार के अंतर्गत होगा।
              </p>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
              <h2 className="text-lg font-bold text-gray-900">18. संपर्क जानकारी</h2>
              <p className="leading-relaxed">
                गोपनीयता संबंधी चिंताओं, शिकायत निवारण या अनुपालन संबंधी प्रश्नों के लिए संपर्क करें:
              </p>
              <div className="mt-3 font-semibold space-y-1.5 text-gray-800">
                <p className="text-md text-orange-700">सनातन वीरशैव लिंगायत ट्रस्ट</p>
                <p>📍 कार्यालय का पता दर्ज करें: [कार्यालय का पता दर्ज करें]</p>
                <p>📞 फ़ोन नंबर: +919480111889</p>
                <p>✉️ ईमेल पता: [ईमेल पता दर्ज करें]</p>
                <p>🌐 वेबसाइट: [वेबसाइट दर्ज करें]</p>
              </div>
            </section>

            <hr className="border-gray-100" />

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">19. गोपनीयता नीति स्वीकार करना</h2>
              <p className="leading-relaxed">
                ट्रस्ट की वर्चुअल करेंसी, वेबसाइट, वॉलेट सिस्टम या डिजिटल सेवाओं का उपयोग करके, उपयोगकर्ता यह स्वीकार करते हैं कि उन्होंने:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>इस गोपनीयता नीति को पढ़ लिया है</li>
                <li>इसमें शामिल जोखिमों को समझ लिया है</li>
                <li>डेटा के संग्रह और प्रसंस्करण के लिए सहमति दे दी है</li>
                <li>यहाँ उल्लिखित नियमों और अनुपालन दायित्वों को स्वीकार कर लिया है।</li>
              </ul>
            </section>
          </article>
        )}
      </div>
    </main>
  );
}
