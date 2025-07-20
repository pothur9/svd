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

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/l1/updateProfile/${userData?.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedData.name,
          dob: editedData.dob,
          peeta: editedData.peeta,
          dhekshaGuru: editedData.dhekshaGuru,
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
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
                  <label className="text-sm font-medium text-gray-600">User ID</label>
                  <p className="p-2 bg-gray-50 rounded-md">{userData.userId}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="p-2 bg-gray-50 rounded-md">{userData.contactNo}</p>
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
      <Footer />
    </>
  );
}