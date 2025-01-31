"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer from "../footer/footer";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n"; // Ensure the correct path

interface FormData {
  name: string;
  dob: string;
  contactNo: string;
  peetarohanaDate: string;
  gender: string;
  karthruGuru: string;
  dhekshaGuru: string;
  peeta: string;
  bhage: string;
  gothra: string;
  mariPresent: string;
  password: string;
  confirmPassword: string;
  imageUrl: string;
  address: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    contactNo: "",
    peetarohanaDate: "",
    gender: "",
    karthruGuru: "",
    dhekshaGuru: "",
    peeta: "",
    bhage: "",
    gothra: "",
    mariPresent: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
    address: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [otpSessionId, setOtpSessionId] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isUserIdVisible, setIsUserIdVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [isResendOtpDisabled, setIsResendOtpDisabled] = useState<boolean>(true);
  const [resendTimer, setResendTimer] = useState<number>(30);

  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`); // Debugging log
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const imageFormData = new FormData();
    imageFormData.append("file", imageFile);
    imageFormData.append("upload_preset", "profilephoto");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxruv6swh/image/upload",
        {
          method: "POST",
          body: imageFormData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN/SVD`
      );
      console.log("OTP sent:", response.data);
      setOtpSessionId(response.data.Details); // Store the session ID
      setIsOtpSent(true);
      setIsResendOtpDisabled(true); // Disable resend button
      setResendTimer(30); // Reset the timer to 30 seconds
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check your phone number.");
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      console.log("OTP verified response:", response.data);
      if (response.data.Status === "Success") {
        setIsOtpVerified(true);
        const imageUrl = await uploadImageToCloudinary();
        if (!imageUrl) {
          alert("Image upload failed");
          return;
        }

        const { confirmPassword, ...submitData } = { ...formData, imageUrl };
        console.log(confirmPassword)
        const result = await fetch("/api/l1/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        const responseData = await result.json();
        alert(responseData.message);
        setUserId(responseData.userId);
        setIsUserIdVisible(true);
        setIsOtpSent(false);
        setOtp("");
        setFormData({
          name: "",
          dob: "",
          contactNo: "",
          peetarohanaDate: "",
          gender: "",
          karthruGuru: "",
          dhekshaGuru: "",
          peeta: "",
          bhage: "",
          gothra: "",
          mariPresent: "",
          password: "",
          confirmPassword: "",
          imageUrl: "",
          address: "",
        });
        setImageFile(null);
        setIsOtpSent(false);
        setOtp("");
      } else {
        alert(`OTP verification failed: ${response.data.Details}`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during OTP verification.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isResendOtpDisabled) {
      await sendOtp();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    await sendOtp();
  };

  const handleLoginRedirect = () => {
    router.push("/l1/login"); // Redirect to the login page
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined; // Explicitly typing the timer
    if (isResendOtpDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setIsResendOtpDisabled(false); // Enable resend button when timer reaches 0
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isResendOtpDisabled, resendTimer]);
  
console.log(language)
console.log(isOtpVerified)
  return (
    <>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("kn")}>ಕನ್ನಡ</button>
      <button onClick={() => changeLanguage("hi")}>हिंदी</button>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "110px", height: "auto" }}
            />
          </div>

          <h2 className="text-2xl font-bold text-black text-center mb-6 mt-10">
            {t("signup.title")}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Date of Birth:
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Contact No:
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Peetarohana Date:
                <input
                  type="date"
                  name="peetarohanaDate"
                  value={formData.peetarohanaDate}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Gender:
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Karthru Guru:
                <input
                  type="text"
                  name="karthruGuru"
                  value={formData.karthruGuru}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Dheksha Guru:
                <input
                  type="text"
                  name="dhekshaGuru"
                  value={formData.dhekshaGuru}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Peeta:
                <input
                  type="text"
                  name="peeta"
                  value={formData.peeta}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Bhage:
                <input
                  type="text"
                  name="bhage"
                  value={formData.bhage}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Gothra:
                <input
                  type="text"
                  name="gothra"
                  value={formData.gothra}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Mari Present:
                <input
                  type="text"
                  name="mariPresent"
                  value={formData.mariPresent}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
               Address
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Confirm Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Profile Picture:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>
            {isOtpSent ? (
              <>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-black">
                    OTP:
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="border rounded-md p-2 w-full bg-white text-black"
                    />
                  </label>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendOtpDisabled}
                    className="text-blue-500 py-2 px-4 rounded-md"
                  >
                    Resend OTP ({resendTimer}s)
                  </button>
                </div>
               
                <div className="flex justify-center mb-4">
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={isVerifyingOtp}
                    className="bg-green-500 text-white py-2 px-4 rounded-md"
                  >
                    {isVerifyingOtp ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}
          </form>
          {isUserIdVisible && (
            <div className="text-center mt-4">
              <p>Your user ID is: {userId}</p>
              <button
                onClick={handleLoginRedirect}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
