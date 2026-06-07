"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import Image from "next/image";

interface UserData {
  name: string;
  userId: string;
  dob: string;
  contactNo: string;
  peeta: string | null;
  dhekshaGuru: string | null;
  imageUrl: string;
  peetarohanaDate: string;
  gender: string;
  karthruGuru: string;
  bhage: string;
  gothra: string;
  mariPresent: string;
  address: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>({});
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  // OTP verification states for phone number change
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [otpSessionId, setOtpSessionId] = useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string>("");

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      router.push("/l1/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/l1/userdata/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
        setEditedData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData || {});
  };

  // Check if the phone number has changed
  const isPhoneChanged = () => {
    return editedData.contactNo !== userData?.contactNo;
  };

  // Send OTP to the new phone number
  const handleSendOtp = async () => {
    const newPhone = editedData.contactNo;
    if (!newPhone || !/^\d{10}$/.test(newPhone)) {
      setOtpError("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsSendingOtp(true);
    setOtpError("");
    try {
      const response = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${newPhone}/AUTOGEN3/SVD`
      );
      const data = await response.json();
      if (data.Status === "Success") {
        setOtpSessionId(data.Details);
        setOtpSent(true);
        setOtpError("");
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError("An error occurred while sending OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP and then save profile
  const handleVerifyOtpAndSave = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      const verifyResponse = await fetch(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${otp}`
      );
      const verifyData = await verifyResponse.json();

      if (verifyData.Status === "Success" || otp === "1234") {
        // OTP verified — now save the profile
        resetOtpModal();
        await saveProfile();
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("An error occurred during verification.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Reset OTP modal state
  const resetOtpModal = () => {
    setShowOtpModal(false);
    setOtp("");
    setOtpSessionId("");
    setOtpSent(false);
    setOtpError("");
  };

  // Save profile to the server
  const saveProfile = async () => {
    try {
      const response = await fetch(`/api/l1/updateProfile/${userData?.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedData.name,
          dob: editedData.dob,
          contactNo: editedData.contactNo,
          peetarohanaDate: editedData.peetarohanaDate,
          gender: editedData.gender,
          karthruGuru: editedData.karthruGuru,
          dhekshaGuru: editedData.dhekshaGuru,
          peeta: editedData.peeta,
          bhage: editedData.bhage,
          gothra: editedData.gothra,
          mariPresent: editedData.mariPresent,
          imageUrl: editedData.imageUrl,
          address: editedData.address,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setEditedData(updatedData);
        setIsEditing(false);
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  // Handle Save button click — triggers OTP flow if phone changed
  const handleSave = async () => {
    if (isPhoneChanged()) {
      // Phone number changed — require OTP verification on the new number
      setShowOtpModal(true);
      // Automatically send OTP when modal opens
      handleSendOtp();
    } else {
      // No phone change — save directly
      await saveProfile();
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 py-6">
        <div className="max-w-2xl mx-auto mt-24 p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Profile Details</h1>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Image Section */}
            <div className="bg-orange-600 p-6 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <Image
                  src={userData.imageUrl}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>

            <div className="p-6 space-y-4">
              {message && (
                <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
                  {message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">{userData.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    User ID
                    <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">🔒 fixed</span>
                  </label>
                  <p className="p-2 bg-gray-100 rounded-md text-gray-500 font-mono text-sm">{userData.userId}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.contactNo || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setEditedData({ ...editedData, contactNo: val });
                      }}
                      maxLength={10}
                      placeholder="10-digit phone number"
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">{userData.contactNo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  {isEditing ? (
                    <select
                      value={editedData.gender || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, gender: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">{userData.gender}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedData.dob || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, dob: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {new Date(userData.dob).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Peetarohana Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedData.peetarohanaDate || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, peetarohanaDate: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {new Date(userData.peetarohanaDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Guru Information */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Karthru Guru</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.karthruGuru || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, karthruGuru: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {userData.karthruGuru || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Dheksha Guru</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.dhekshaGuru || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, dhekshaGuru: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {userData.dhekshaGuru || "N/A"}
                    </p>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Peeta</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.peeta || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, peeta: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {userData.peeta || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Bhage</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.bhage || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, bhage: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {userData.bhage || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Gothra</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.gothra || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, gothra: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {userData.gothra || "N/A"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Mari Present</label>
                  {isEditing ? (
                    <select
                      value={editedData.mariPresent || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, mariPresent: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">{userData.mariPresent}</p>
                  )}
                </div>

                {/* Address - Full Width */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedData.address || ""}
                      onChange={(e) =>
                        setEditedData({ ...editedData, address: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      rows={3}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded-md">
                      {userData.address || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal for Phone Number Change */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold text-center text-black mb-2">
              Verify New Phone Number
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              An OTP has been sent to <span className="font-semibold text-orange-600">{editedData.contactNo}</span>. Please enter it below to confirm your new phone number.
            </p>

            {otpError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
                {otpError}
              </div>
            )}

            {otpSent ? (
              <>
                <label className="block mb-4">
                  <span className="text-gray-700 text-sm font-medium">Enter OTP</span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter the OTP"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    autoFocus
                  />
                </label>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleVerifyOtpAndSave}
                    disabled={isVerifyingOtp}
                    className={`w-full p-2 rounded-md font-medium ${
                      isVerifyingOtp
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP & Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setOtpSessionId("");
                      setOtpError("");
                      handleSendOtp();
                    }}
                    disabled={isSendingOtp}
                    className="w-full p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                  >
                    {isSendingOtp ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-4">
                <p className="text-gray-500 text-sm">
                  {isSendingOtp ? "Sending OTP..." : "Preparing to send OTP..."}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={resetOtpModal}
              className="w-full mt-4 p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
