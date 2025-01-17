"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { requestFcmToken } from "../../../lib/firebase";
import Image from "next/image";
export default function PersonalDetailsForm() {
  const [l2Users, setL2Users] = useState([]);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    async function fetchL2Users() {
      try {
        const response = await fetch("/api/l3/findl2users");
        if (!response.ok) throw new Error("Failed to fetch L2 users");
        const users = await response.json();
        setL2Users(users);
      } catch (error) {
        console.error(error);
      }
    }
    fetchL2Users();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, photoUrl: file }));
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { contactNo, photoUrl } = formData;
    setIsLoading(true); // Set loading to true when the signup button is clicked
    try {
      const otpResponse = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${contactNo}/AUTOGEN/SVD`
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
    }finally {
      setIsLoading(false); // Reset loading state after OTP process
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      // Request FCM Token
      const fcmToken = await requestFcmToken();
      if (!fcmToken) {
        alert("Failed to retrieve FCM token.");
        return;
      }
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${sessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success") {
        alert("OTP verified successfully. Completing signup...");

        // Upload photo to Cloudinary
        const photoFormData = new FormData();
        photoFormData.append("file", formData.photoUrl); // Ensure you're appending the actual file here
        photoFormData.append("upload_preset", "profilephoto");

        const photoResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dxruv6swh/image/upload",
          {
            method: "POST",
            body: photoFormData,
          }
        );

        if (!photoResponse.ok) throw new Error("Failed to upload photo");
        const photoData = await photoResponse.json();

        const response = await fetch("/api/l4/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            photoUrl: photoData.secure_url, 

            selectedL2User: formData.selectedL2User,
            fcmToken
          }),
        });

        if (response.ok) {
          alert("User signed up successfully!");
          router.push("/l4/login");
        } else {
          alert("Failed to sign up user.");
        }
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred during OTP verification.");
    }finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-100 min-h-screen py-6 sm:py-10">
      <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl text-gray-800">
         <div className="flex justify-center">
                  <Image src="/logo.png" alt="Logo" width={100} height={100} />
                </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Personal Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold">
              Name
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
              Date of Birth
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
              Gender
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
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contactNo" className="block text-sm font-semibold">
              Contact No.
            </label>
            <input
              type="tel"
              name="contactNo"
              id="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="mailId" className="block text-sm font-semibold">
              Mail ID
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
              Karthru Guru
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
              Peeta
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
              Bhage
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
              Gothra
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
              Nationality
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
              Present Address
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
              Permanent Address
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
              Qualification
            </label>
            <select
              name="qualification"
              id="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white"
            >
              <option value="">Select Qualification</option>
              <option value="Business">Business</option>
              <option value="Job">Job</option>
            </select>
          </div>

          <div>
            <label htmlFor="occupation" className="block text-sm font-semibold">
              Occupation
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
              Languages Known
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
              Select L2 User
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
              Upload Photo
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
              Password
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
              Confirm Password
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
    </div>
  );
}
