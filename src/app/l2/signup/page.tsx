"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

import Image from "next/image";

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      const res = await fetch("https://api.cloudinary.com/v1_1/dxruv6swh/image/upload", {
        method: "POST",
        body: imageFormData,
      });

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
      console.log(confirmPassword)
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          {[
            { label: "Name", type: "text", name: "name", required: true },
            {
              label: "Date of Birth",
              type: "date",
              name: "dob",
              required: true,
            },
            {
              label: "Contact No",
              type: "tel",
              name: "contactNo",
              required: true,
            },
            {
              label: "Date of Peetarohana",
              type: "date",
              name: "peetarohanaDate",
              required: true,
            },
            {
              label: "Gender",
              type: "select",
              name: "gender",
              options: [
                { value: "", label: "Select" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ],
              required: true,
            },
            {
              label: "Name of Karthru Guru",
              type: "text",
              name: "karthruGuru",
              required: true,
            },
            {
              label: "Name of Dheksha Guru",
              type: "text",
              name: "dhekshaGuru",
              required: true,
            },
            { label: "Bhage", type: "text", name: "bhage", required: true },
            { label: "Gothra", type: "text", name: "gothra", required: true },
            { label: "If Mari Present", type: "text", name: "mariPresent" },
            { label: "Address", type: "text", name: "address", required: true },
            {
              label: "Password",
              type: "password",
              name: "password",
              required: true,
            },
            {
              label: "Confirm Password",
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

          {/* Dropdown for Peeta (l2 users) */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-black">
              Peeta:
              <select
                name="peeta"
                value={formData.peeta}
                onChange={handleChange}
                required
                className="border rounded-md p-2 w-full bg-white text-black"
              >
                {l1Users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-black">
              Profile Image:
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

        {isUserIdVisible && (
          <div className="mt-4 text-center">
            <h3 className="font-semibold text-lg">Your User ID: {userId}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
