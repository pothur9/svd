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
  };
  l2UserCount: number;
  l3UserCount: number;
  l4UserCount: number;
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
      </div>
      <Footer />
    </>
  );
}
