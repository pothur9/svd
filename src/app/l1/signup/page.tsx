"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer
 from "../footer/footer";
import Navbar from "@/app/l2/navbar/page";
export default function SignupForm() {
  const [formData, setFormData] = useState({
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
  const [imageFile, setImageFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [userId, setUserId] = useState("");
  const [isUserIdVisible, setIsUserIdVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendOtpDisabled, setIsResendOtpDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);


  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
    const imageFormData = new FormData();
    imageFormData.append("file", imageFile);
    imageFormData.append("upload_preset", "profilephoto");
    try {
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

  const handleSubmit = async (e) => {
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
    let timer;
    if (isResendOtpDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setIsResendOtpDisabled(false); // Enable resend button when timer reaches 0
    }
    return () => clearTimeout(timer);
  }, [isResendOtpDisabled, resendTimer]);

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-black text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          {[
            { label: "Name", type: "text", name: "name", required: true },
            { label: "Date of Birth", type: "date", name: "dob", required: true },
            { label: "Contact No", type: "tel", name: "contactNo", required: true },
            { label: "Date of Peetarohana", type: "date", name: "peetarohanaDate", required: true },
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
            { label: "Name of Karthru Guru", type: "text", name: "karthruGuru", required: true },
            { label: "Name of Dheksha Guru", type: "text", name: "dhekshaGuru", required: true },
            { label: "Peeta", type: "text", name: "peeta", required: true },
            { label: "Bhage", type: "text", name: "bhage", required: true },
            { label: "Gothra", type: "text", name: "gothra", required: true },
            { label: "If Mari Present", type: "text", name: "mariPresent" },
            { label: "Address", type: "text", name: "address", required: true }, // Add address field
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
            className={`bg-blue-500 text-white px-4 py-2 rounded w-full transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
           <p className="text-center mt-4 text-gray-700">
          Already have an account?{" "}
          <button
            onClick={handleLoginRedirect}
            className="text-blue-500 underline hover:text-blue-600"
          >
            Login
          </button>
        </p>
        </form>
        {isOtpSent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4">Enter OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={verifyOtp}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handleResendOtp}
                  className={`${
                    isResendOtpDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-4 py-2 rounded`}
                  disabled={isResendOtpDisabled}
                >
                  {isResendOtpDisabled
                    ? `Resend OTP (${resendTimer}s)`
                    : "Resend OTP"}
                </button>
                <p className="text-gray-600 text-sm">
                  Didn’t receive OTP? Check your network.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* User ID Modal */}
        {isUserIdVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-black">User ID Created</h2>
              <p className="text-black">Your unique User ID is: <strong>{userId}</strong></p>
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
    <Footer/>
    </>

  );
}
