"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n"; // Ensure the correct path
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  [key: string]: string;
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

  const [l1Users, setL1Users] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isUserIdVisible, setIsUserIdVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    async function fetchL1Users() {
      try {
        const response = await axios.get("/api/l2/getguruname");
        setL1Users(response.data || []);
      } catch (error) {
        console.error("Error fetching l1 users:", error);
      }
    }
    fetchL1Users();
  }, []);
  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`); // Debugging log
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files ? e.target.files[0] : null);
  };

  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!imageFile) return null;
    try {
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
      imageFormData.append("upload_preset", "profilephoto");

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN/SVD`
      );
      console.log("OTP sent:", response.data);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY3/${formData.contactNo}/${otp}`
      );
      console.log("OTP verified:", response.data);
      setIsOtpVerified(true);

      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        alert("Image upload failed");
        return;
      }

      const { confirmPassword, ...submitData } = {
        ...formData,
        imageUrl,
      };
      console.log(confirmPassword);
      const result = await fetch("/api/l2/signup", {
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
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("OTP verification failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };  const handleLoginRedirect = () => {
    router.push("/l2/login"); // Redirect to the login page
  
}; console.log(language)

  return (
    <>
      <div className="flex flex-col items-center p-2 bg-gray-100 rounded-xl shadow-md">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center">
            <Image src="/logomain1.png" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-2xl font-bold text-black text-center mb-6">
            {t("signupl2.title")}
          </h2>
           {/* Dropdown for Peeta (l2 users) */}
           <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl1.peeta")}
                <select
                  name="peeta"
                  value={formData.peeta}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                >
                  {" "}
                  <option value="">Select L2 User</option>
                  {l1Users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            {[
              {
                label: t("signupl2.name"),
                type: "text",
                name: "name",
                required: true,
              },
              {
                label: t("signupl2.dob"),
                type: "date",
                name: "dob",
                required: true,
              },
              {
                label: t("signupl2.contactNo"),
                type: "number",
                name: "contactNo",
                required: true,
              },
              {
                label: t("signupl2.peetarohanaDate"),
                type: "date",
                name: "peetarohanaDate",
                required: true,
              },
              {
                label: t("signupl2.gender"),
                type: "select",
                name: "gender",
                options: [
                  { value: "", label: "Select" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ],
                required: true,
              },
              {
                label: t("signupl2.karthruGuru"),
                type: "text",
                name: "karthruGuru",
                required: true,
              },
              {
                label: t("signupl2.dhekshaGuru"),
                type: "text",
                name: "dhekshaGuru",
                required: true,
              },
              {
                label: t("signupl2.bhage"),
                type: "text",
                name: "bhage",
                required: true,
              },
              {
                label: t("signupl2.gothra"),
                type: "text",
                name: "gothra",
                required: true,
              },
              {
                label: t("signupl2.mariPresent"),
                type: "text",
                name: "mariPresent",
              },
              { label: t("signupl2.address"), type: "text", name: "address" },
              {
                label: t("signupl2.password"),
                type: "password",
                name: "password",
                required: true,
              },
              {
                label: t("signupl2.confirmPassword"),
                type: "password",
                name: "confirmPassword",
                required: true,
              },
            ].map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 font-semibold text-black">
                  {field.label}:
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      className="border rounded-md p-2 w-full bg-white text-black"
                    >
                      {field.options ? (
                        field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      ) : (
                        <option value="">No options available</option>
                      )}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      className="border rounded-md p-2 w-full bg-white text-black"
                    />
                  )}
                </label>
              </div>
            ))}

           

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl1.uploadProfilePicture")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
            </div>

           
            {/* Submit Button */}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={isLoading || isOtpVerified}
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              {isOtpSent && !isOtpVerified && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="border rounded-md p-2 w-full bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="ml-2 px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Loading Spinner */}
          {isVerifyingOtp && !isOtpVerified && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 border-solid"></div>
              <span className="ml-4 text-lg font-semibold text-blue-600">
                Verifying OTP...
              </span>
            </div>
          )}
          {/* User ID Display */}
          {isUserIdVisible && (
            <div className="text-center mt-4">
              <p className="text-black">Your user ID is: {userId}</p>
              <button
                onClick={handleLoginRedirect}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Go to Login
              </button>
            </div>
          )}
          <p>
            have an account?
            <a href="/l2/login" className="text-blue-500 hover:text-blue-700">
              &nbsp; Move to login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
