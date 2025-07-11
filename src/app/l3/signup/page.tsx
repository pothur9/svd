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
  const [statesData, setStatesData] = useState<{ [state: string]: string[] }>({});
  const [selectedPresentState, setSelectedPresentState] = useState<string>("");
  const [selectedPresentDistrict, setSelectedPresentDistrict] = useState<string>("");
  const [presentCity, setPresentCity] = useState<string>("");
  // Add state for permanent address fields
  const [permanentState, setPermanentState] = useState<string>("");
  const [permanentDistrict, setPermanentDistrict] = useState<string>("");
  const [permanentCity, setPermanentCity] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  // Phone number input: allow only numbers and max 10 digits
  const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setFormData((prevData) => ({ ...prevData, contactNo: value }));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.selectedL2User) newErrors.selectedL2User = "Please select a peeta.";
    if (!formData.name.trim()) newErrors.name = "Please enter your name.";
    if (!formData.dob) newErrors.dob = "Please enter your date of birth.";
    if (!formData.gender) newErrors.gender = "Please select your gender.";
    if (!formData.contactNo) newErrors.contactNo = "Please enter your phone number.";
    else if (!/^\d{10}$/.test(formData.contactNo)) newErrors.contactNo = "Phone number must be exactly 10 digits.";
    if (formData.mailId && !/^\S+@\S+\.\S+$/.test(formData.mailId)) newErrors.mailId = "Please enter a valid email address.";
    if (!formData.karthruGuru.trim()) newErrors.karthruGuru = "Please enter Karthru Guru.";
    if (!formData.peeta.trim()) newErrors.peeta = "Please enter Peeta.";
    if (!selectedPresentState) newErrors.presentState = "Please select your present state.";
    if (!selectedPresentDistrict) newErrors.presentDistrict = "Please select your present district.";
    if (!presentCity.trim()) newErrors.presentCity = "Please enter your present city.";
    if (!formData.qualification) newErrors.qualification = "Please select your qualification.";
    if (!formData.occupation.trim()) newErrors.occupation = "Please enter your occupation.";
    if (!formData.languageKnown.trim()) newErrors.languageKnown = "Please enter languages known.";
    if (!formData.password) newErrors.password = "Please enter a password.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.photoUrl || !(formData.photoUrl instanceof File)) newErrors.photoUrl = "Please upload a valid photo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;
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

        // Use updatedFormData with correct presentAddress
        const presentAddress = `${selectedPresentState}, ${selectedPresentDistrict}, ${presentCity}`;
        const permanentAddress = `${permanentState}, ${permanentDistrict}, ${permanentCity}`;
        const response = await fetch("/api/l3/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            presentAddress,
            permanentAddress,
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
            {t("signupl1.title")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Move Select L2 User to the top */}
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
                <option value="">Select peeta</option>
                {l2Users.map((user: { name: string }, index: number) => (
                  <option key={index} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.selectedL2User && <p className="text-red-500 text-xs mt-1">{errors.selectedL2User}</p>}
            </div>
            {/* Name field follows L2 User */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">
                {t("signupl1.name")}
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
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold">
                {t("signupl1.dob")}
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
                {t("signupl1.gender")}
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
                {t("signupl1.contactNo")}
              </label>
              <input
                type="text"
                name="contactNo"
                id="contactNo"
                value={formData.contactNo}
                onChange={handlePhoneInput}
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
                required
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
              />
              {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
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
              {errors.mailId && <p className="text-red-500 text-xs mt-1">{errors.mailId}</p>}
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
              {errors.karthruGuru && <p className="text-red-500 text-xs mt-1">{errors.karthruGuru}</p>}
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
              {errors.peeta && <p className="text-red-500 text-xs mt-1">{errors.peeta}</p>}
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

            {/* Present Address Stepper */}
            <div>
              <label className="block text-sm font-semibold">Present Address</label>
              <div className="flex flex-col gap-2">
                <select
                  name="presentState"
                  value={selectedPresentState}
                  onChange={handlePresentStateChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesData).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.presentState && <p className="text-red-500 text-xs mt-1">{errors.presentState}</p>}
                <select
                  name="presentDistrict"
                  value={selectedPresentDistrict}
                  onChange={handlePresentDistrictChange}
                  required={!!selectedPresentState}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  disabled={!selectedPresentState}
                >
                  <option value="">{selectedPresentState ? "Select District" : "Select State First"}</option>
                  {selectedPresentState && statesData[selectedPresentState] &&
                    statesData[selectedPresentState].map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                </select>
                {errors.presentDistrict && <p className="text-red-500 text-xs mt-1">{errors.presentDistrict}</p>}
                <input
                  type="text"
                  name="presentCity"
                  value={presentCity}
                  onChange={handlePresentCityChange}
                  required={!!selectedPresentDistrict}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter City Name"
                  disabled={!selectedPresentDistrict}
                />
                {errors.presentCity && <p className="text-red-500 text-xs mt-1">{errors.presentCity}</p>}
              </div>
            </div>
            {/* Permanent Address Stepper */}
            <div>
              <label className="block text-sm font-semibold">Permanent Address</label>
              <div className="flex flex-col gap-2">
                <select
                  name="permanentState"
                  value={permanentState}
                  onChange={e => setPermanentState(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select State</option>
                  {Object.keys(statesData).map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  name="permanentDistrict"
                  value={permanentDistrict}
                  onChange={e => setPermanentDistrict(e.target.value)}
                  required={!!permanentState}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  disabled={!permanentState}
                >
                  <option value="">{permanentState ? "Select District" : "Select State First"}</option>
                  {permanentState && statesData[permanentState] &&
                    statesData[permanentState].map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                </select>
                <input
                  type="text"
                  name="permanentCity"
                  value={permanentCity}
                  onChange={e => setPermanentCity(e.target.value)}
                  required={!!permanentDistrict}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter City Name"
                  disabled={!permanentDistrict}
                />
              </div>
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
              {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
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
              {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
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
              {errors.languageKnown && <p className="text-red-500 text-xs mt-1">{errors.languageKnown}</p>}
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
              {errors.photoUrl && <p className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold">
                {t("signupl1.password")}
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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
           {/* Already have an account? Move to Login */}
           <div className="text-center mt-4">
             <span>Already have an account? </span>
             <button
               type="button"
               className="text-blue-600 underline hover:text-blue-800"
               onClick={() => router.push("/l3/login")}
             >
               Move to Login
             </button>
           </div>
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
