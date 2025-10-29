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
import Image from "next/image";
import { auth } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

interface FormData {
  name: string;
  contactNo: string;
  peeta: string;
  karthruGuru: string;
  // Optional fields for completion later (kept here so inputs can bind without TS errors)
  selectedL2User?: string;
  dob?: string;
  gender?: string;
  mailId?: string;
  bhage?: string;
  gothra?: string;
  nationality?: string;
  presentAddress?: string;
  permanentAddress?: string;
  qualification?: string;
  occupation?: string;
  languageKnown?: string;
  photoUrl?: File | string | null;
  kula?: string;
  subKula?: string;
}

export const dynamic = "force-dynamic"; // Prevent pre-rendering issues

export default function PersonalDetailsForm() {
  const [l2Users, setL2Users] = useState([]);
  const [peetaOptions, setPeetaOptions] = useState<string[]>([]);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contactNo: "",
    peeta: "",
    karthruGuru: "",
    selectedL2User: "",
    dob: "",
    gender: "",
    mailId: "",
    bhage: "",
    gothra: "",
    nationality: "",
    presentAddress: "",
    permanentAddress: "",
    qualification: "",
    occupation: "",
    languageKnown: "",
    photoUrl: null,
    kula: "",
    subKula: "",
  });
  const { t } = useTranslation();
  const router = useRouter();
  const [statesData, setStatesData] = useState<{ [state: string]: string[] }>({});
  const [selectedPresentState, setSelectedPresentState] = useState<string>("");
  const [selectedPresentDistrict, setSelectedPresentDistrict] = useState<string>("");
  const [presentCity, setPresentCity] = useState<string>("");
  const [selectedPermanentState, setSelectedPermanentState] = useState<string>("");
  const [selectedPermanentDistrict, setSelectedPermanentDistrict] = useState<string>("");
  const [permanentCity, setPermanentCity] = useState<string>("");
  const [presentTaluk, setPresentTaluk] = useState<string>("");
  const [presentLandmark, setPresentLandmark] = useState<string>("");
  const [permanentTaluk, setPermanentTaluk] = useState<string>("");
  const [permanentLandmark, setPermanentLandmark] = useState<string>("");

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  const fetchL2Users = useCallback(async () => {
    try {
      const response = await fetch("/api/l3/findl2users");
      if (!response.ok) throw new Error("Failed to fetch L2 users.");
      const users = await response.json();
      setL2Users(users);
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

  useEffect(() => {
    const fetchPeetaOptions = async () => {
      try {
        const response = await fetch("/api/l1/dashboard");
        if (response.ok) {
          const data = await response.json();
          const peetas = (data as Array<{ l1User: { peeta: string } }>).map((item) => item.l1User.peeta);
          setPeetaOptions(peetas);
        }
      } catch (error) {
        console.error("Error fetching peeta options:", error);
      }
    };
    fetchPeetaOptions();
  }, []);

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setStatesData(data))
      .catch((err) => console.error("Failed to load districts.json", err));
  }, []);

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

  const handlePresentStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPresentState(e.target.value);
    setSelectedPresentDistrict("");
    setPresentCity("");
    setFormData((prev) => ({ ...prev, presentAddress: "" }));
  };
  const handlePresentDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPresentDistrict(e.target.value);
    setPresentCity("");
    setFormData((prev) => ({ ...prev, presentAddress: "" }));
  };
  const handlePresentCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPresentCity(e.target.value);
    setFormData((prev) => ({ ...prev, presentAddress: `${selectedPresentState}, ${selectedPresentDistrict}, ${e.target.value}` }));
  };
  const handlePresentTalukChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPresentTaluk(e.target.value);
    setFormData((prev) => ({
      ...prev,
      presentAddress: `${selectedPresentState}, ${selectedPresentDistrict}, ${presentCity}, ${e.target.value}, ${presentLandmark}`,
    }));
  };
  const handlePresentLandmarkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPresentLandmark(e.target.value);
    setFormData((prev) => ({
      ...prev,
      presentAddress: `${selectedPresentState}, ${selectedPresentDistrict}, ${presentCity}, ${presentTaluk}, ${e.target.value}`,
    }));
  };
  const handlePermanentStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPermanentState(e.target.value);
    setSelectedPermanentDistrict("");
    setPermanentCity("");
    setFormData((prev) => ({ ...prev, permanentAddress: "" }));
  };
  const handlePermanentDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPermanentDistrict(e.target.value);
    setPermanentCity("");
    setFormData((prev) => ({ ...prev, permanentAddress: "" }));
  };
  const handlePermanentCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPermanentCity(e.target.value);
    setFormData((prev) => ({ ...prev, permanentAddress: `${selectedPermanentState}, ${selectedPermanentDistrict}, ${e.target.value}` }));
  };
  const handlePermanentTalukChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPermanentTaluk(e.target.value);
    setFormData((prev) => ({
      ...prev,
      permanentAddress: `${selectedPermanentState}, ${selectedPermanentDistrict}, ${permanentCity}, ${e.target.value}, ${permanentLandmark}`,
    }));
  };
  const handlePermanentLandmarkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPermanentLandmark(e.target.value);
    setFormData((prev) => ({
      ...prev,
      permanentAddress: `${selectedPermanentState}, ${selectedPermanentDistrict}, ${permanentCity}, ${permanentTaluk}, ${e.target.value}`,
    }));
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
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/${formData.contactNo}/AUTOGEN3/SVD`
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

    setIsVerifyingOtp(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success") {
        alert("OTP verified successfully. Completing signup...");

        // Conditionally upload photo if provided
        let uploadedPhotoUrl: string | undefined;
        if (formData.photoUrl && formData.photoUrl instanceof File) {
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
          uploadedPhotoUrl = photoData.secure_url as string;
        }

        // Create Firebase user
        let firebaseUid = "";
        try {
          const tempEmail = `${formData.contactNo}@svd.temp`;
          const tempPassword = `SVD${formData.contactNo}@2024`;
          const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, tempPassword);
          firebaseUid = userCredential.user.uid;
          console.log("Firebase user created with UID:", firebaseUid);
        } catch (firebaseError) {
          console.error("Firebase user creation error:", firebaseError);
          if ((firebaseError as { code?: string }).code === 'auth/email-already-in-use') {
            alert("This phone number is already registered.");
            return;
          }
        }

        const response = await fetch("/api/l4/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            contactNo: formData.contactNo,
            peeta: formData.peeta,
            karthruGuru: formData.karthruGuru,
            firebaseUid,
            ...(uploadedPhotoUrl ? { photoUrl: uploadedPhotoUrl } : {}),
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
  };

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
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            {t("signupl3.title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div>
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
              >
                <option value="">Select Sri 108 Prabhu Shivachryaru</option>
                {l2Users.map((user: { name: string }, index: number) => (
                  <option key={index} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div> */}
                <div>
              <label htmlFor="peeta" className="block text-sm font-semibold">
                {t("signupl3.peeta")}
              </label>
              <select
                name="peeta"
                id="peeta"
                value={formData.peeta}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select Peeta</option>
                {peetaOptions.map((peeta, index) => (
                  <option key={index} value={peeta}>{peeta}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="karthruGuru" className="block text-sm font-semibold">
                {t("signupl3.karthruGuru")}
              </label>
              <select
                name="karthruGuru"
                id="karthruGuru"
                value={formData.karthruGuru}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select Guru</option>
                {l2Users.map((user: { name: string }, index: number) => (
                  <option key={index} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="kula" className="block text-sm font-semibold">
                Kula / ಕುಲ
              </label>
              <select
                name="kula"
                id="kula"
                value={formData.kula}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, kula: value, subKula: "" }));
                }}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select Kula</option>
                <option value="Veerashaiva Lingayatha">Veerashaiva Lingayatha / ವೀರಶೈವ ಲಿಂಗಾಯತ</option>
              </select>
            </div>

            {formData.kula && (
              <div>
                <label htmlFor="subKula" className="block text-sm font-semibold">
                  Sub Kula / ಉಪಕುಲ
                </label>
                <select
                  name="subKula"
                  id="subKula"
                  value={formData.subKula}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="">Select Sub Kula</option>
                  <option value="Panchamasaligaru">Panchamasaligaru / ಪಂಚಮಸಾಲಿಗರು</option>
                  <option value="Banajigaru">Banajigaru / ಬಣಜಿಗರು</option>
                  <option value="Kadi - vakkaligaru">Kadi - vakkaligaru / ಕಡಿ - ವಕ್ಕಲಿಗರು</option>
                  <option value="Kumbararu">Kumbararu / ಕುಂಬಾರರು</option>
                  <option value="Madivalaru">Madivalaru / ಮಡಿವಾಳರು</option>
                  <option value="Lalagondaru">Lalagondaru / ಲಾಲಗೊಂಡರು</option>
                  <option value="Pakanaka reddy">Pakanaka reddy / ಪಕನಕ ರೆಡ್ಡಿ</option>
                  <option value="Reddy">Reddy / ರೆಡ್ಡಿ</option>
                  <option value="Gaanigaru">Gaanigaru / ಗಾಣಿಗರು</option>
                  <option value="Sadharu">Sadharu / ಸಧರು</option>
                  <option value="Nonabaru">Nonabaru / ನೊನಬಾರು</option>
                  <option value="Shetty ligayatha">Shetty ligayatha / ಶೆಟ್ಟಿ ಲಿಗಾಯತ</option>
                  <option value="Gouda lingyatha">Gouda lingyatha / ಗೌಡ ಲಿಂಗಾಯತ</option>
                </select>
              </div>
            )}
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

            <div className="hidden">
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
              />
            </div>

            <div className="hidden">
              <label htmlFor="gender" className="block text-sm font-semibold">
                {t("signupl3.gender")}
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
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

            <div className="hidden">
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
{/* 
            <div>
              <label
                htmlFor="karthruGuru"
                className="block text-sm font-semibold"
              >
                {t("signupl3.karthruGuru")}
              </label>
              <select
                name="karthruGuru"
                id="karthruGuru"
                value={formData.karthruGuru}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select Guru</option>
                {l2Users.map((user: { name: string }, index: number) => (
                  <option key={index} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div> */}

            {/* <div>
              <label htmlFor="peeta" className="block text-sm font-semibold">
                {t("signupl3.peeta")}
              </label>
              <select
                name="peeta"
                id="peeta"
                value={formData.peeta}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
              >
                <option value="">Select Peeta</option>
                {peetaOptions.map((peeta, index) => (
                  <option key={index} value={peeta}>{peeta}</option>
                ))}
              </select>
            </div> */}

            <div className="hidden">
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

            <div className="hidden">
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

            <div className="hidden">
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

            {/* Present Address Stepper */}
            <div className="hidden">
              <label className="block text-sm font-semibold">Present Address</label>
              <div className="flex flex-col gap-2">
                <select
                  name="presentState"
                  value={selectedPresentState}
                  onChange={handlePresentStateChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesData).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  name="presentDistrict"
                  value={selectedPresentDistrict}
                  onChange={handlePresentDistrictChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  disabled={!selectedPresentState}
                >
                  <option value="">{selectedPresentState ? "Select District" : "Select State First"}</option>
                  {selectedPresentState && statesData[selectedPresentState] &&
                    statesData[selectedPresentState].map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                </select>
                <input
                  type="text"
                  name="presentCity"
                  value={presentCity}
                  onChange={handlePresentCityChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter City Name"
                  disabled={!selectedPresentDistrict}
                />
                <input
                  type="text"
                  name="presentTaluk"
                  value={presentTaluk}
                  onChange={handlePresentTalukChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter Taluk Name"
                  disabled={!selectedPresentDistrict}
                />
                <input
                  type="text"
                  name="presentLandmark"
                  value={presentLandmark}
                  onChange={handlePresentLandmarkChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter Landmark"
                  disabled={!selectedPresentDistrict}
                />
              </div>
            </div>
            {/* Permanent Address Stepper */}
            <div className="hidden">
              <label className="block text-sm font-semibold">Permanent Address</label>
              <div className="flex flex-col gap-2">
                <select
                  name="permanentState"
                  value={selectedPermanentState}
                  onChange={handlePermanentStateChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesData).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  name="permanentDistrict"
                  value={selectedPermanentDistrict}
                  onChange={handlePermanentDistrictChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  disabled={!selectedPermanentState}
                >
                  <option value="">{selectedPermanentState ? "Select District" : "Select State First"}</option>
                  {selectedPermanentState && statesData[selectedPermanentState] &&
                    statesData[selectedPermanentState].map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                </select>
                <input
                  type="text"
                  name="permanentCity"
                  value={permanentCity}
                  onChange={handlePermanentCityChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter City Name"
                  disabled={!selectedPermanentDistrict}
                />
                <input
                  type="text"
                  name="permanentTaluk"
                  value={permanentTaluk}
                  onChange={handlePermanentTalukChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter Taluk Name"
                  disabled={!selectedPermanentDistrict}
                />
                <input
                  type="text"
                  name="permanentLandmark"
                  value={permanentLandmark}
                  onChange={handlePermanentLandmarkChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter Landmark"
                  disabled={!selectedPermanentDistrict}
                />
              </div>
            </div>

            <div className="hidden">
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

            <div className="hidden">
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

            <div className="hidden">
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

            {/* <div>
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
            </div> */}
            <div className="hidden">
              <label htmlFor="photo" className="block text-sm font-semibold">
                {t("signupl3.photoUrl")}
              </label>
              <input
                type="file"
                name="photoUrl"
                id="photoUrl"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
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
                  try {
                    if (typeof window !== 'undefined') {
                      sessionStorage.clear();
                      localStorage.clear();
                    }
                  } catch {}
                  router.push("/l4/login");
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
