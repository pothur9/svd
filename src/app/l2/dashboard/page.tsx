"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

interface L1User {
  _id: string;
  name: string;
  peeta: string;
}

interface MemberData {
  l1User: L1User;
  l2UserCount: number;
  l3UserCount: number;
  l4UserCount: number;
}

interface UserData {
  name: string;
  userId: string;
  contactNo: string;
  dob?: string;
  address?: string;
  peeta?: string;
  dhekshaGuru?: string;
  imageUrl: string;
}

export default function Dashboard(): JSX.Element {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push("/l2/login");
      return;
    }

    const fetchMemberData = async () => {
      try {
        const memberResponse = await fetch(`/api/l1/dashboard`);
        if (!memberResponse.ok) throw new Error("Failed to fetch member data");

        const memberData: MemberData[] = await memberResponse.json();
        setMemberData(memberData);

        const userResponse = await fetch(`/api/l2/dashboard/${userId}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData: UserData = await userResponse.json();
        setUserData(userData);

        // Store peeta name and username in session storage
        sessionStorage.setItem("peeta", userData.peeta || "");
        sessionStorage.setItem("username", userData.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMemberData();
  }, [router]);

  if (memberData.length === 0 || !userData) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="bg-slate-100">
        <br />
        <br />
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-24">
          Dashboard
        </h1>
        <div className="flex flex-wrap justify-center gap-8 ">
          {memberData.map(
            ({ l1User, l2UserCount, l3UserCount, l4UserCount }) => (
              <div
                key={l1User._id}
                className="flex items-center p-4 bg-white shadow-lg rounded-lg space-x-4 sm:flex-row w-full md:w-auto overflow-x-auto"
              >
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    Branch: {l1User.name}
                  </h2>
                  <h2 className="text-lg font-bold text-gray-800">
                    Peeta: {l1User.peeta}
                  </h2>
                </div>

                <div className="p-2 bg-blue-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-blue-800">
                    L1 Users
                  </h3>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {l1User.name}
                  </p>
                </div>

                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                <div className="p-2 bg-blue-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-blue-800">
                    L2 Users
                  </h3>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {l2UserCount}
                  </p>
                </div>

                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                <div className="p-2 bg-green-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-green-800">
                    L3 Users
                  </h3>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {l3UserCount}
                  </p>
                </div>

                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                <div className="p-2 bg-green-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-green-800">
                    L4 Users
                  </h3>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {l4UserCount}
                  </p>
                </div>

                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                <div className="p-2 bg-purple-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-purple-800">
                    Total Users
                  </h3>
                  <p className="text-xl font-bold text-purple-600 mt-1">
                    {l2UserCount + l3UserCount}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
        <br />
        <br />
          
      {/* Green Card with Member Details */}
      <div
          className="flex flex-col sm:flex-row items-center p-4 shadow-lg relative mx-auto max-w-[90%] sm:max-w-[600px] bg-orange-600 rounded-xl overflow-hidden"
          style={{ height: "auto", minHeight: "200px" }}
        >
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-[70px] sm:w-[90px]" />
          </div>
          <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex-grow text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Sanathanaveershivadharma
            </h1>
            <p className="text-white text-sm font-semibold">
              ------------------
            </p>
            <p className="text-white text-sm">
              Professional description or tagline goes here
            </p>
          </div>
          <div className="mt-4 sm:mt-0 absolute sm:static top-[90%] sm:top-auto right-4 sm:right-auto transform -translate-y-1/2 sm:transform-none">
            <img
              src={userData.imageUrl}
              alt="Secondary Logo"
              className="w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] rounded-full border-4 border-green-700 shadow-lg object-cover mb-16"
            />
          </div>
        </div>

        {/* White Section with Dynamic Data */}
        <div className="bg-white p-6 shadow-lg mx-auto mt-4 max-w-[90%] sm:max-w-[600px] rounded-xl " style={{marginTop:"-10px"}}>
          <p className="text-black text-base font-semibold mt-4">
            Name: {userData.name}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Membership No: {userData.userId}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Date:{" "}
            {userData.dob && !isNaN(Date.parse(userData.dob))
              ? new Date(userData.dob).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "N/A"}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Phone: {userData.contactNo}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Peeta: {userData.peeta || "N/A"}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Guru: {userData.dhekshaGuru || "N/A"}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Address: {userData.address || "N/A"}
          </p>
        </div>
        <br />
        <br />
      </div>
      <Footer/>
    </>
  );
}
