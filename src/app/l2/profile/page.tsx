"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

// Update the UserData interface at the top of the file
interface UserData {
  _id?: string;
  parampare: string;
  userId: string;
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
  imageUrl: string;
  address: string;
}

export default function Profile(): JSX.Element {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      router.push("/l2/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/l2/dashboard/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        console.log("Fetched user data:", data); // Debug log
        console.log("Image URL:", data.imageUrl); // Debug image URL
        setUserData(data);
        setEditedData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (!editedData) return;
    
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await fetch(`/api/l2/update-profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedData.name,
          dob: editedData.dob,
          peetarohanaDate: editedData.peetarohanaDate,
          gender: editedData.gender,
          parampare: editedData.parampare,
          karthruGuru: editedData.karthruGuru,
          dhekshaGuru: editedData.dhekshaGuru,
          peeta: editedData.peeta,
          bhage: editedData.bhage,
          gothra: editedData.gothra,
          mariPresent: editedData.mariPresent,
          address: editedData.address,
          imageUrl: editedData.imageUrl
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-orange-600 p-6">
              <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`p-4 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message.text}
              </div>
            )}

            {/* Profile Content */}
            <div className="p-6">
              {/* Profile Image Section */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <img
                    src={userData?.imageUrl || "/logomain1.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-200"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      e.currentTarget.src = "/logomain1.png";
                    }}
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            try {
                              const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                setEditedData(prev => ({
                                  ...prev!,
                                  imageUrl: data.url
                                }));
                              }
                            } catch (error) {
                              console.error('Error uploading image:', error);
                              setMessage({ type: 'error', text: 'Failed to upload image' });
                            }
                          }
                        }}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </label>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{userData?.name}</h2>
                  <p className="text-gray-600">Member ID: {userData?.userId}</p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  // Edit Mode
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editedData?.name || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, name: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={editedData?.contactNo || ''}
                        disabled
                        className="w-full p-2 border rounded-md bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editedData?.dob?.split('T')[0] || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, dob: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peetarohana Date</label>
                      <input
                        type="date"
                        value={editedData?.peetarohanaDate?.split('T')[0] || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, peetarohanaDate: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={editedData?.gender || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, gender: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parampare</label>
                      <input
                        type="text"
                        value={editedData?.parampare || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, parampare: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Karthru Guru</label>
                      <input
                        type="text"
                        value={editedData?.karthruGuru || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, karthruGuru: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dheksha Guru</label>
                      <input
                        type="text"
                        value={editedData?.dhekshaGuru || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, dhekshaGuru: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peeta</label>
                      <input
                        type="text"
                        value={editedData?.peeta || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, peeta: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bhage</label>
                      <input
                        type="text"
                        value={editedData?.bhage || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, bhage: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gothra</label>
                      <input
                        type="text"
                        value={editedData?.gothra || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, gothra: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mari Present</label>
                      <input
                        type="text"
                        value={editedData?.mariPresent || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, mariPresent: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={editedData?.address || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev!, address: e.target.value }))}
                        rows={3}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <ProfileField label="Name" value={userData?.name} />
                    <ProfileField label="User ID" value={userData?.userId} />
                    <ProfileField label="Phone Number" value={userData?.contactNo} />
                    <ProfileField 
                      label="Date of Birth" 
                      value={userData?.dob ? new Date(userData.dob).toLocaleDateString() : undefined} 
                    />
                    <ProfileField 
                      label="Peetarohana Date" 
                      value={userData?.peetarohanaDate ? new Date(userData.peetarohanaDate).toLocaleDateString() : undefined} 
                    />
                    <ProfileField label="Gender" value={userData?.gender} />
                    <ProfileField label="Parampare" value={userData?.parampare} />
                    <ProfileField label="Karthru Guru" value={userData?.karthruGuru} />
                    <ProfileField label="Dheksha Guru" value={userData?.dhekshaGuru} />
                    <ProfileField label="Peeta" value={userData?.peeta} />
                    <ProfileField label="Bhage" value={userData?.bhage} />
                    <ProfileField label="Gothra" value={userData?.gothra} />
                    <ProfileField label="Mari Present" value={userData?.mariPresent} />
                    <ProfileField label="Address" value={userData?.address} span={2} />
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(userData);
                      }}
                      className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
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

// Helper component for profile fields
function ProfileField({ label, value, span = 1 }: { label: string; value?: string; span?: number }) {
  return (
    <div className={`${span === 2 ? 'md:col-span-2' : ''}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <p className="text-gray-900">{value || 'N/A'}</p>
    </div>
  );
}