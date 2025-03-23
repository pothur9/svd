"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

interface MemberData {
  l1User: {
    _id: string;
    name: string;
    peeta: string;
    userId?: string;
  };
  l2UserCount: number;
  l3UserCount: number;
  l4UserCount: number;
  totalUserCount: number;
  l2Users: any[];
  l3Users: any[];
  l4Users: any[];
}

interface UserData {
  name: string;
  userId: string;
  dob: string;
  contactNo: string;
  peeta: string | null;
  dhekshaGuru: string | null;
  imageUrl: string;
}

export default function Dashboard() {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push("/l1/login");
      return;
    }

    async function fetchData() {
      try {
        const storedUserId = sessionStorage.getItem("userId");

        if (!storedUserId) {
          router.push("/l1/login");
        } else {
          setUserId(storedUserId);
        }
        
        // Fetch member data with no caching
        const memberResponse = await fetch(`/api/l1/dashboard?timestamp=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (!memberResponse.ok) throw new Error("Failed to fetch member data");
        const memberData: MemberData[] = await memberResponse.json();
        setMemberData(memberData);
        console.log(memberData);
         // Calculate total user count
         const totalUsers = memberData.reduce((acc, member) => {
          return acc + member.l2UserCount + member.l3UserCount + member.l4UserCount;
        }, 0);
        setTotal(totalUsers);

        // Fetch user data with no caching
        const userResponse = await fetch(`/api/l1/userdata/${storedUserId}?timestamp=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData: UserData = await userResponse.json();
        setUserData(userData);

        if (userData && userData.name) {
          sessionStorage.setItem("username", userData.name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [router]);

  if (!userData) return <p>Loading...</p>;

  // Define background colors for peetas in a repeating pattern
  const bgColors = [
    "bg-yellow-300",
    "bg-green-400",
    "bg-red-400",
    "bg-blue-400",
    "bg-gray-300",
    "bg-yellow-200",
    "bg-orange-300"
  ];
console.log(userId)
  return (
    <>
      <Navbar />
      <div className="bg-slate-100 py-6">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-24">
          Dashboard
        </h1>
        <div>
          {/* User Info Section */}
          <div
            className="items-center p-4 shadow-lg relative mx-auto max-w-[90%] sm:max-w-[500px] bg-orange-600 rounded-xl overflow-hidden mt-6"
            style={{ height: "100px" }}
          >
            <h1 className="text-lg sm:text-2xl font-bold text-white float-right">
              &nbsp; Sanathanaveershivadharma
            </h1>
            <div className="flex-shrink-0 float-left">
              <img
                src="/logomain1.png"
                alt="Logo"
                className="w-[80px] sm:w-[110px]"
                style={{ marginTop: "-35px" }}
              />
            </div>
          </div>

          {/* User Personal Details */}
          <div
            className="bg-white p-6 shadow-lg mx-auto mt-4 max-w-[90%] sm:max-w-[500px] rounded-xl bg-yellow-100"
            style={{ marginTop: "-30px", fontSize: "5px" }}
          >
            <div
              className="flex-shrink-0 float-right"
              style={{ marginTop: "10px" }}
            >
              <img
                src={userData.imageUrl}
                alt="User"
                className="w-[80px] sm:w-[110px] h-[80px] sm:h-[110px] rounded-full object-cover mb-16 float-right"
              />
            </div>
            <p className="text-black text-base font-semibold mt-4" style={{ fontSize: "15px" }}>
              Name: {userData.name}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Membership No: {userData.userId}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Date: {userData.dob && !isNaN(Date.parse(userData.dob)) 
                ? new Date(userData.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) 
                : "N/A"}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Phone: {userData.contactNo}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Peeta: {userData.peeta || "N/A"}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Guru: {userData.dhekshaGuru || "N/A"}
            </p>
          </div>
        </div>

        {/* Table Structure with API Data */}
        <div className="overflow-x-auto mx-auto max-w-[90%] sm:max-w-[95%] mt-10">
          <table className="w-full border-collapse border border-gray-800 bg-white shadow-lg text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-800 p-1 sm:p-2 bg-orange-600 text-white text-center">Level / Peeta</th>
                {memberData.map((member, index) => (
                  <th 
                    key={index} 
                    className={`border border-gray-800 p-1 sm:p-2 text-center ${bgColors[index % bgColors.length]}`}
                  >
                    {member.l1User.peeta}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* L1 Row - Names */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L1 (Name)</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">
                    {member.l1User.name || "N/A"}
                  </td>
                ))}
              </tr>
              
              {/* L2 Row - User Counts */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L2 Count</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">
                    {member.l2UserCount}
                  </td>
                ))}
              </tr>
              
              {/* L3 Row - User Counts */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L3 Count</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">
                    {member.l3UserCount}
                  </td>
                ))}
              </tr>
              
              {/* L4 Row - User Counts */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L4 Count</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">
                    {member.l4UserCount}
                  </td>
                ))}
              </tr>
              
              {/* Total Row */}
              <tr className="border border-gray-800 bg-orange-100 hover:bg-orange-200 font-bold">
                <td className="border border-gray-800 p-1 sm:p-2 text-center">Total</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">
                    {member.l2UserCount + member.l3UserCount + member.l4UserCount}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
       {/* Display Overall Total */}
       <h1 className="text-center font-bold text-black mt-6 text-lg sm:text-2xl">
          Grand Total: {total}
        </h1>
      </div>
     
      <Footer />
    </>
  );
}