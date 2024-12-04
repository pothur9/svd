"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { requestFcmToken } from "../../../lib/firebase";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    contactNo: "",
    peetarohanaDate: "",
    gender: "",
    karthruGuru: "",
    dhekshaGuru: "",
    peeta: "", // Will be populated with selected l1 user
    bhage: "",
    gothra: "",
    mariPresent: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
    address: "",
  });
  const [l1Users, setL1Users] = useState([]); // Initialize as an empty array
  const [imageFile, setImageFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [userId, setUserId] = useState("");
  const [isUserIdVisible, setIsUserIdVisible] = useState(false);

  useEffect(() => {
    async function fetchL1Users() {
      try {
        const response = await axios.get("/api/l2/getguruname");
        console.log("Fetched L1 Users:", response.data);

        setL1Users(response.data);
      } catch (error) {
        console.error("Error fetching l1 users:", error);
        setL1Users([]);
      }
    }
    fetchL1Users();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN/SVD`
      );
      console.log("OTP sent:", response.data);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      // Request FCM Token
      const fcmToken = await requestFcmToken();
      if (!fcmToken) {
        alert("Failed to retrieve FCM token.");
        return;
      }

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

      const { confirmPassword, ...submitData } = { ...formData, imageUrl, fcmToken };

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          {[ 
            { label: "Name", type: "text", name: "name", required: true },
            { label: "Date of Birth", type: "date", name: "dob", required: true },
            { label: "Contact No", type: "tel", name: "contactNo", required: true },
            { label: "Date of Peetarohana", type: "date", name: "peetarohanaDate", required: true },
            { label: "Gender", type: "select", name: "gender", options: [
                { value: "", label: "Select" }, 
                { value: "male", label: "Male" }, 
                { value: "female", label: "Female" }, 
                { value: "other", label: "Other" }], required: true },
            { label: "Name of Karthru Guru", type: "text", name: "karthruGuru", required: true },
            { label: "Name of Dheksha Guru", type: "text", name: "dhekshaGuru", required: true },
            { label: "Bhage", type: "text", name: "bhage", required: true },
            { label: "Gothra", type: "text", name: "gothra", required: true },
            { label: "If Mari Present", type: "text", name: "mariPresent" },
            { label: "Address", type: "text", name: "address", required: true },
            { label: "Password", type: "password", name: "password", required: true },
            { label: "Confirm Password", type: "password", name: "confirmPassword", required: true },
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
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
                <option value="">Select a Guru</option>
                {l1Users.length > 0 ? (
                  l1Users.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))
                ) : (
                  <option value="">No Gurus Available</option>
                )}
              </select>
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-black">
              Upload Profile Picture:
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="border rounded-md p-2 w-full bg-white text-black"
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        {/* OTP Modal */}
        {isOtpSent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-black">Enter OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded w-full bg-white text-black"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={verifyOtp}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User ID Modal */}
        {isUserIdVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-black">
                User ID Created
              </h2>
              <p className="text-black">
                Your unique User ID is: <strong>{userId}</strong>
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsUserIdVisible(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
