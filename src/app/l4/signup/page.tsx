"use client";

import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n"; // Ensure the correct path

interface FormData {
  name: string;
  dob: string;
  gender: string;
  contactNo: string;
  mailId: string;
  karthruGuru: string;
  peeta: string;
  bhage: string;
  gothra: string;
  nationality: string;
  presentAddress: string;
  permanentAddress: string;
  qualification: string;
  occupation: string;
  languageKnown: string;
  selectedL2User: string;
  password: string;
  confirmPassword: string;
  photoUrl: File | string;
}

export const dynamic = "force-dynamic"; // Prevent pre-rendering issues

export default function PersonalDetailsForm() {
  const [l2Users, setL2Users] = useState([]);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    gender: "",
    contactNo: "",
    mailId: "",
    karthruGuru: "",
    peeta: "",
    bhage: "",
    gothra: "",
    nationality: "",
    presentAddress: "",
    permanentAddress: "",
    qualification: "",
    occupation: "",
    languageKnown: "",
    selectedL2User: "",
    password: "",
    confirmPassword: "",
    photoUrl: "",
  });
  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`); // Debugging log
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };
  const fetchL2Users = useCallback(async () => {
    try {
      const response = await fetch("/api/l3/findl2users");
      if (!response.ok) throw new Error("Failed to fetch L2 users.");
      const users = await response.json();
      setL2Users(users);
      console.log(l2Users);
    } catch (error) {
      console.error("Error fetching L2 users:", error);
    }
  }, []);

  useEffect(() => {
    fetchL2Users();
  }, [fetchL2Users]);

  useEffect(() => {
    console.log("Updated L2 Users:", l2Users);
  }, [l2Users]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, photoUrl: file }));
    }
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.contactNo) {
      alert("Please enter a valid contact number.");
      return;
    }

    setIsLoading(true);
    try {
      const otpResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/${formData.contactNo}/AUTOGEN/SVD`
      );
      const otpData = await otpResponse.json();

      if (otpData.Status === "Success") {
        setSessionId(otpData.Details);
        setShowOtpPopup(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending the OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!sessionId) {
      alert("Session ID is missing. Please retry OTP verification.");
      return;
    }

    if (!formData.photoUrl || !(formData.photoUrl instanceof File)) {
      alert("Please upload a valid photo.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success") {
        alert("OTP verified successfully. Completing signup...");

        const photoFormData = new FormData();
        photoFormData.append("file", formData.photoUrl);
        photoFormData.append(
          "upload_preset",
          `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
        );

        const photoResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,

          {
            method: "POST",
            body: photoFormData,
          }
        );

        if (!photoResponse.ok) throw new Error("Failed to upload photo.");
        const photoData = await photoResponse.json();

        const response = await fetch("/api/l3/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            photoUrl: photoData.secure_url,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setUserId(result.userId);
          setShowSuccessModal(true);
        } else {
          alert("Failed to sign up user.");
        }
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during OTP verification.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };console.log(language)

  return (
    <>
      <div className="flex flex-col items-center p-6 bg-gray-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Select Your Language
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => changeLanguage("en")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("kn")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => changeLanguage("hi")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            हिंदी
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-b from-slate-50 to-blue-100 min-h-screen py-6 sm:py-10">
        <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl text-gray-800">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            {t("signupl3.title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">
                {t("signupl3.name")}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold">
                {t("signupl3.dob")}
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold">
                {t("signupl3.gender")}
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contactNo"
                className="block text-sm font-semibold"
              >
                {t("signupl3.contactNo")}
              </label>
              <input
                type="tel"
                name="contactNo"
                id="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                onBlur={() => {
                  if (!/^\d{10}$/.test(formData.contactNo)) {
                    alert("Please enter a valid 10-digit phone number.");
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="mailId" className="block text-sm font-semibold">
                {t("signupl3.mailId")}
              </label>
              <input
                type="email"
                name="mailId"
                id="mailId"
                value={formData.mailId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="karthruGuru"
                className="block text-sm font-semibold"
              >
                {t("signupl3.karthruGuru")}
              </label>
              <input
                type="text"
                name="karthruGuru"
                id="karthruGuru"
                value={formData.karthruGuru}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="peeta" className="block text-sm font-semibold">
                {t("signupl3.peeta")}
              </label>
              <input
                type="text"
                name="peeta"
                id="peeta"
                value={formData.peeta}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            <div>
              <label htmlFor="bhage" className="block text-sm font-semibold">
                {t("signupl3.bhage")}
              </label>
              <input
                type="text"
                name="bhage"
                id="bhage"
                value={formData.bhage}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label htmlFor="gothra" className="block text-sm font-semibold">
                {t("signupl3.gothra")}
              </label>
              <input
                type="text"
                name="gothra"
                id="gothra"
                value={formData.gothra}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-semibold"
              >
                {t("signupl3.nationality")}
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="presentAddress"
                className="block text-sm font-semibold"
              >
                {t("signupl3.presentAddress")}
              </label>
              <input
                type="text"
                name="presentAddress"
                id="presentAddress"
                value={formData.presentAddress}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="permanentAddress"
                className="block text-sm font-semibold"
              >
                {t("signupl3.permanentAddress")}
              </label>
              <input
                type="text"
                name="permanentAddress"
                id="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="qualification"
                className="block text-sm font-semibold"
              >
                {t("signupl3.qualification")}
              </label>
              <select
                name="qualification"
                id="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select Qualification</option>
                <option value="Job">Degree</option>
                <option value="Business"> puc</option>
                <option value="Job">10</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-semibold"
              >
                {t("signupl3.occupation")}
              </label>
              <input
                type="text"
                name="occupation"
                id="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="languageKnown"
                className="block text-sm font-semibold"
              >
                {t("signupl3.languageKnown")}
              </label>
              <input
                type="text"
                name="languageKnown"
                id="languageKnown"
                value={formData.languageKnown}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="selectedL2User"
                className="block text-sm font-semibold"
              >
                {t("signupl3.selectedL2User")}
              </label>
              <select
                name="selectedL2User"
                id="selectedL2User"
                value={formData.selectedL2User}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select L2 User</option>
                {l2Users.map((user: { name: string }, index: number) => (
                  <option key={index} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-semibold">
                {t("signupl3.photoUrl")}
              </label>
              <input
                type="file"
                name="photoUrl"
                id="photoUrl"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold">
                {t("signupl3.password")}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold"
              >
                {t("signupl3.confirmPassword")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Signing Up...</span> // You can replace this with a spinner icon
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
        {showOtpPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Enter OTP</h3>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                placeholder="Enter OTP"
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleVerifyOtp}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={() => setShowOtpPopup(false)}
                  className="flex-1 p-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-xl w-96">
              <h2 className="text-2xl font-semibold mb-4">
                Signup Successful!
              </h2>
              <p className="mb-4">
                Your User ID is: <strong>{userId}</strong>
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/l3/login");
                }}
              >
                Proceed to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
