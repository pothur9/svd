"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

// Define types for the fetched data
interface MemberData {
  l1User: {
    _id: string;
    name: string;
    peeta: string;
  };
  l2UserCount: number;
  l3UserCount: number;
  l4UserCount: number;
}

interface UserData {
  name: string;
  userId: string;
  contactNo: string;
  dob: string;
  peeta: string;
  selectedL2User: string;
  permanentAddress: string;
  photoUrl: string;
}

export default function Dashboard() {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push("/l4/login");
      return;
    }

    async function fetchMemberData() {
      try {
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

        const response = await fetch(`/api/l4/dashboard/${userId}?timestamp=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");

        const userData: UserData = await response.json();
        setUserData(userData);

        // Store peeta name and username in session storage
        sessionStorage.setItem("peeta", userData.peeta);
        sessionStorage.setItem("username", userData.name);
        sessionStorage.setItem("guru", userData.selectedL2User);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }

    fetchMemberData();
  }, [router]);

  if (memberData.length === 0 || !userData) return <p>Loading...</p>;

  return (
    <>
      <Navbar /><br />
      <div className="bg-slate-100"><br /><br /><br />

        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 ">
          Dashboard
        </h1>
     
        <br />
        <br />
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
                src={userData.photoUrl}
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
              Guru: {userData.selectedL2User || "N/A"}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Phone number: {userData.contactNo || "N/A"}
            </p>
            <p className="text-black text-base font-semibold mt-1" style={{ fontSize: "15px" }}>
              Address: {userData.permanentAddress || "N/A"}
            </p>
          </div>
        <br />
        <br />
             {/* Responsive Table */}
             <div className="overflow-x-auto mx-auto max-w-[90%] sm:max-w-[800px] mt-10">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg text-xs sm:text-sm">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="border p-1 sm:p-2 text-left">Peeta</th>
                <th className="border p-1 sm:p-2 text-center">L1</th>
                <th className="border p-1 sm:p-2 text-center">L2</th>
                <th className="border p-1 sm:p-2 text-center">L3</th>
                <th className="border p-1 sm:p-2 text-center">L4</th>
                <th className="border p-1 sm:p-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {memberData.map(({ l1User, l2UserCount, l3UserCount, l4UserCount }) => (
                <tr key={l1User._id} className="hover:bg-gray-100 text-black">
                  <td className="border p-1 sm:p-2">{l1User.peeta}</td>
                  <td className="border p-1 sm:p-2 text-center">{l1User.name}</td>
                  <td className="border p-1 sm:p-2 text-center">{l2UserCount}</td>
                  <td className="border p-1 sm:p-2 text-center">{l3UserCount}</td>
                  <td className="border p-1 sm:p-2 text-center">{l4UserCount}</td>
                  <td className="border p-1 sm:p-2 text-center">{l2UserCount + l3UserCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br/>
      </div>
      <Footer />
    </>
  );
}
