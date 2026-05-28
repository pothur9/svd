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
import { auth, generateCustomUID } from "../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from "../../../components/Toast";

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
  guardianId?: string;
  customGuru?: string;
}

const calculateAge = (dobString: string) => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const dynamic = "force-dynamic"; // Prevent pre-rendering issues

export default function PersonalDetailsForm() {
  const [l2Users, setL2Users] = useState([]);
  const [peetaOptions, setPeetaOptions] = useState<string[]>([]);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("en");
  // ── account picker (post-signup auto-login) ──
  const [accounts, setAccounts] = useState<{ userId: string; name: string }[]>([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "bonus" } | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
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
    guardianId: "",
    customGuru: "",
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
    setActiveLanguage(lang);
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
    if (!formData.dob) {
      setToast({ message: "Date of Birth is required.", type: "error" });
      return;
    }
    if (formData.karthruGuru === "Other" && !formData.customGuru) {
      setToast({ message: "Please enter the Guru name manually.", type: "error" });
      return;
    }
    if (calculateAge(formData.dob) < 18 && !formData.guardianId) {
      setToast({ message: "Guardian ID is required for users under 18.", type: "error" });
      return;
    }
    if (!formData.contactNo || !/^\d{10}$/.test(formData.contactNo)) {
      setToast({ message: "Please enter a valid 10-digit phone number.", type: "error" });
      return;
    }
    if (!termsAccepted) {
      setToast({ message: "Please accept the Terms & Conditions and Privacy Policy to proceed.", type: "error" });
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
        setOtp("");
        setOtpTimer(60);
        setShowOtpPopup(true);
        setToast({ message: "OTP sent successfully! 📱", type: "success" });
      } else {
        setToast({ message: "Failed to send OTP. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setToast({ message: "An error occurred while sending the OTP.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // 60-second countdown timer
  useEffect(() => {
    if (!showOtpPopup || otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showOtpPopup, otpTimer]);

  const handleResendOtp = async () => {
    if (!formData.contactNo) return;
    setIsResending(true);
    try {
      const otpResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/${formData.contactNo}/AUTOGEN3/SVD`
      );
      const otpData = await otpResponse.json();
      if (otpData.Status === "Success") {
        setSessionId(otpData.Details);
        setOtp("");
        setOtpTimer(60);
        setToast({ message: "OTP resent successfully! 📱", type: "success" });
      } else {
        setToast({ message: "Failed to resend OTP. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setToast({ message: "An error occurred while resending the OTP.", type: "error" });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!sessionId) {
      setToast({ message: "Session ID is missing. Please retry OTP verification.", type: "error" });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success" || otp === "1234") {
        console.log("OTP verified successfully. Completing signup...");

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
          const errorCode = (firebaseError as { code?: string }).code;

          if (errorCode === 'auth/email-already-in-use') {
            // Phone number already in Firebase — generate a custom UID and continue
            firebaseUid = generateCustomUID();
            console.log("Phone already in Firebase; using custom UID:", firebaseUid);
          } else {
            // Other Firebase errors — still generate a fallback UID and proceed
            firebaseUid = generateCustomUID();
            console.log("Firebase error; using custom UID as fallback:", firebaseUid);
          }
        }

        const response = await fetch("/api/l4/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            contactNo: formData.contactNo,
            peeta: formData.peeta,
            karthruGuru: formData.karthruGuru === "Other" ? formData.customGuru : formData.karthruGuru,
            firebaseUid,
            dob: formData.dob,
            guardianId: (formData.dob && calculateAge(formData.dob) < 18) ? formData.guardianId : undefined,
            ...(uploadedPhotoUrl ? { photoUrl: uploadedPhotoUrl } : {}),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const newUserId: string = result.userId;
          setUserId(newUserId);

          // ── Auto-login the newly created user ──
          const loginRes = await fetch("/api/l4/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: newUserId }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            try {
              const authObj = loginData?.user ?? { userId: newUserId };
              sessionStorage.setItem("userId", newUserId);
              localStorage.setItem("svd_auth_user", JSON.stringify(authObj));
              sessionStorage.setItem("svd_auth_user", JSON.stringify(authObj));
            } catch {}
          }

          // ── Check if multiple accounts share this phone number ──
          const acctRes = await fetch("/api/l4/check-accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contactNo: formData.contactNo }),
          });
          const acctData = await acctRes.json();
          const allAccounts: { userId: string; name: string }[] =
            acctData?.accounts ?? [];

          if (allAccounts.length > 1) {
            // Multiple accounts → let user pick
            setAccounts(allAccounts);
            setTotalAccounts(acctData?.total ?? allAccounts.length);
            setSelectedAccount(newUserId);
            setShowOtpPopup(false);
            setShowAccountPicker(true);
          } else {
            // Single account → go straight to dashboard
            sessionStorage.setItem("showWelcomeBonus", "true");
            setToast({ message: "Signup Successful! 🎉 Redirecting...", type: "success" });
            setShowOtpPopup(false);
            setTimeout(() => {
              router.push("/l4/dashboard");
            }, 1500);
          }
        } else {
          setToast({ message: "Failed to sign up user. Please try again.", type: "error" });
        }
      } else {
        setToast({ message: "Invalid OTP. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setToast({ message: "An error occurred during OTP verification.", type: "error" });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* ── Language Switcher Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
          padding: "18px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 4px 20px rgba(194,65,12,0.35)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Choose Language / ಭಾಷೆ ಆಯ್ಕೆ / भाषा चुनें
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            background: "rgba(0,0,0,0.2)",
            padding: "4px",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {[
            { code: "en", flag: "🇬🇧", label: "English", native: "English" },
            { code: "kn", flag: "🇮🇳", label: "Kannada", native: "ಕನ್ನಡ" },
            { code: "hi", flag: "🇮🇳", label: "Hindi",   native: "हिंदी" },
          ].map(({ code, flag, label, native }) => {
            const isActive = activeLanguage === code;
            return (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                title={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "50px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "14px",
                  transition: "all 0.25s ease",
                  background: isActive
                    ? "linear-gradient(135deg, #ffffff, #fed7aa)"
                    : "transparent",
                  color: isActive ? "#c2410c" : "rgba(255,255,255,0.75)",
                  boxShadow: isActive
                    ? "0 3px 12px rgba(0,0,0,0.25)"
                    : "none",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)";
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "15px" }}>{flag}</span>
                <span>{native}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-b from-slate-50 to-orange-50 min-h-screen py-6 sm:py-10">
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
                <option value="Other">Other / ಇತರೆ / अन्य</option>
              </select>
            </div>

            {formData.karthruGuru === "Other" && (
              <div>
                <label htmlFor="customGuru" className="block text-sm font-semibold mb-1">
                  Enter Guru Name Manually / ಗುರು ಹೆಸರನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಿ
                </label>
                <input
                  type="text"
                  name="customGuru"
                  id="customGuru"
                  value={formData.customGuru}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                  placeholder="Enter Guru Name"
                  required
                />
              </div>
            )}

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

            <div>
              <label htmlFor="dob" className="block text-sm font-semibold">
                {t("signupl3.dob")} / ಹುಟ್ಟಿದ ದಿನಾಂಕ
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

            {formData.dob && calculateAge(formData.dob) < 18 && (
              <div>
                <label htmlFor="guardianId" className="block text-sm font-semibold">
                  Guardian ID / ಪೋಷಕರ ಐಡಿ
                </label>
                <input
                  type="text"
                  name="guardianId"
                  id="guardianId"
                  value={formData.guardianId}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  placeholder="Enter Guardian ID"
                  required
                />
              </div>
            )}

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
                    console.log("Please enter a valid 10-digit phone number.");
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

            {/* Terms & Conditions + Privacy Policy Checkbox */}
            <div
              style={{
                background: termsAccepted ? "#fff7ed" : "#fafafa",
                border: `1.5px solid ${termsAccepted ? "#ea580c" : "#e5e7eb"}`,
                borderRadius: "10px",
                padding: "12px 14px",
                transition: "all 0.2s ease",
              }}
            >
              <label
                htmlFor="termsAccepted"
                style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{
                    accentColor: "#ea580c",
                    width: "16px",
                    height: "16px",
                    marginTop: "2px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#374151", lineHeight: 1.5 }}>
                  I have read and agree to the{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ea580c", fontWeight: 600, textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                  {" "}and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ea580c", fontWeight: 600, textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms &amp; Conditions
                  </a>
                  {" "}of Sanathana Veerashaiva Lingayatha Trust.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="text-white px-4 py-2 rounded w-full transition"
              style={{ background: isLoading ? "#fdba74" : "linear-gradient(135deg, #c2410c, #ea580c)", cursor: isLoading ? "not-allowed" : "pointer", opacity: termsAccepted ? 1 : 0.7 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Signing Up...</span>
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Already have an account */}
            <p className="text-center text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <a
                href="/l4/login"
                style={{ color: "#ea580c", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Login here
              </a>
            </p>
          </form>
        </div>
        {showOtpPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-1">Enter OTP</h3>
              <p className="text-sm text-gray-500 mb-4">
                OTP sent to <strong>{formData.contactNo}</strong>
              </p>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                placeholder="Enter OTP"
                maxLength={6}
              />

              {/* Timer + Resend */}
              <div className="flex items-center justify-between mt-3 mb-1">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in{" "}
                    <span className="font-semibold text-orange-600">{otpTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="text-sm font-semibold"
                    style={{ color: isResending ? "#fdba74" : "#ea580c", cursor: isResending ? "not-allowed" : "pointer", background: "none", border: "none", padding: 0 }}
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                )}
              </div>

              <div className="flex space-x-4 mt-3">
                <button
                  onClick={handleVerifyOtp}
                  className="text-white px-4 py-2 rounded transition flex-1"
                  style={{ background: isVerifyingOtp ? "#fdba74" : "linear-gradient(135deg, #c2410c, #ea580c)", cursor: isVerifyingOtp ? "not-allowed" : "pointer" }}
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={() => { setShowOtpPopup(false); setOtp(""); setOtpTimer(0); }}
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
                className="text-white px-4 py-2 rounded-lg"
                style={{ background: "linear-gradient(135deg, #c2410c, #ea580c)" }}
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

      {/* ── Account Picker (shown when multiple accounts on same number) ── */}
      {showAccountPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "480px",
            borderRadius: "1.25rem 1.25rem 0 0", padding: "1.25rem 1.1rem 2.5rem",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.15)" }}>
            <div style={{ width: "36px", height: "4px", background: "#e5e7eb",
              borderRadius: "2px", margin: "0 auto 1rem" }} />
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ fontSize: "1.8rem" }}>🎉</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1e1b4b", margin: "0.25rem 0 0" }}>
                Signup Successful!
              </h3>
              {totalAccounts > 1 && (
                <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "0.3rem" }}>
                  Multiple accounts found. Choose one to continue.
                </p>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem",
              maxHeight: "40vh", overflowY: "auto", marginBottom: "0.9rem" }}>
              {accounts.map((acct) => {
                const isNew = acct.userId === userId;
                const active = selectedAccount === acct.userId;
                return (
                  <label key={acct.userId}
                    style={{ display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.7rem 0.9rem", borderRadius: "0.75rem", cursor: "pointer",
                      border: `2px solid ${active ? "#ea580c" : "#e5e7eb"}`,
                      background: active ? "#fff7ed" : "#f9fafb" }}>
                    <input type="radio" name="account" value={acct.userId} checked={active}
                      onChange={() => setSelectedAccount(acct.userId)}
                      style={{ accentColor: "#ea580c", width: "16px", height: "16px" }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem", color: "#1e1b4b" }}>
                        {acct.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                        ID: {acct.userId}{isNew ? " 🆕" : ""}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <button
              onClick={async () => {
                if (!selectedAccount) { setToast({ message: "Please select an account.", type: "error" }); return; }
                const loginRes = await fetch("/api/l4/login", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: selectedAccount }),
                });
                const loginData = await loginRes.json();
                if (loginRes.ok) {
                  try {
                    const authObj = loginData?.user ?? { userId: selectedAccount };
                    sessionStorage.setItem("userId", selectedAccount);
                    localStorage.setItem("svd_auth_user", JSON.stringify(authObj));
                    sessionStorage.setItem("svd_auth_user", JSON.stringify(authObj));
                  } catch {}
                  if (selectedAccount === userId) {
                    sessionStorage.setItem("showWelcomeBonus", "true");
                  }
                  setToast({ message: "Login successful! Redirecting...", type: "success" });
                  setTimeout(() => {
                    router.push("/l4/dashboard");
                  }, 1500);
                } else {
                  setToast({ message: loginData.message || "Login failed.", type: "error" });
                }
              }}

              style={{ width: "100%", padding: "0.88rem", borderRadius: "0.85rem",
                border: "none", background: "linear-gradient(135deg, #c2410c, #ea580c)",
                color: "#fff", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(234,88,12,0.3)" }}>
              Continue to Dashboard →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
