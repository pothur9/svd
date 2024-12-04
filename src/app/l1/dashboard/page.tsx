// app/l1/dashboard/page.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";

export default function Dashboard() {
  const [memberData, setMemberData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId"); // Get userId from session storage

    if (!userId) {
      router.push("/l1/login"); // Redirect to login page if userId is not present
      return; // Exit the useEffect to prevent further execution
    }

    // Fetch member data from the API endpoint
    async function fetchMemberData() {
      try {
        const response = await fetch(`/api/l1/dashboard/${userId}`); // Include userId in the API call
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMemberData(data);
        if (data.name) {
          sessionStorage.setItem("username", data.name);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }

    fetchMemberData();
  }, [router]);

  if (!memberData) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-slate-50 to-blue-100 min-h-screen py-6 sm:py-10">
        <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl text-gray-800 relative">
          {/* Party Logo */}
          <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-md flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>

          {/* Header */}
          <div className="text-center mt-12 sm:mt-16 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">
              Sanathanaveershivadharma
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Upadhyaya Marg, New Delhi - 110002
            </p>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-blue-600 shadow-md">
              <Image
                src={memberData.imageUrl} // Profile image from fetched data
                alt="Profile Image"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
          </div>

          {/* Member Details */}
          <div className="mt-6 sm:mt-8 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
            <div className="space-y-3 sm:space-y-4 text-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Name:</span>
                <span className="text-sm sm:text-base">{memberData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                  Phone Number:
                </span>
                <span className="text-sm sm:text-base">
                  {memberData.contactNo}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">
                  Membership No:
                </span>
                <span className="text-sm sm:text-base">
                  {memberData.userId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Green Card with Member Details */}
      <div
        className="bg-green-700 flex items-center p-4 shadow-lg relative mx-auto max-w-[90%] sm:max-w-[600px]"
        style={{ height: "200px" }}
      >
        {/* Logo Image */}
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full border-4 border-white shadow-md"
          />
        </div>

        {/* Text Content */}
        <div className="ml-4 flex-grow">
          <h1 className="text-xl sm:text-2xl font-bold text-white-600">
            Sanathanaveershivadharma
          </h1>
          <p className="text-white text-sm font-semibold ">------------------</p>
          <p className="text-white text-sm">
            Professional description or tagline goes here
          </p>
        </div>

        {/* Secondary Image */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 sm:top-1/2 sm:right-4 sm:-translate-y-1/2 sm:mt-[0px] mt-[90px]">
          <Image
            src={memberData.imageUrl} 
            alt="Secondary Logo"
            width={100} // Smaller size for mobile
            height={100} // Smaller size for mobile
            className="rounded-full border-4 border-green-700 shadow-lg " // Larger size for larger screens
          />
        </div>
      </div>

      {/* White Section with Dynamic Data */}
      <div
        className="bg-white p-6 shadow-lg mx-auto max-w-[90%] sm:max-w-[600px]"
        style={{ height: "200px" }}
      >
        <p className="text-black text-base font-semibold mt-4">
          Name:   {memberData.name}
        </p>
        <p className="text-black text-base font-semibold mt-2">
          Membership No: {memberData.userId}
        </p>
        <p className="text-black text-base font-semibold mt-2">
          Phone:   {memberData.contactNo}
        </p>
        <p className="text-black text-base font-semibold mt-2">
          Peeta: {memberData.peeta || "N/A"}
        </p>
        <p className="text-black text-base font-semibold mt-2">
          Guru: {memberData.
dhekshaGuru || "N/A"}
        </p>
       
      </div>
    </>
  );
}
