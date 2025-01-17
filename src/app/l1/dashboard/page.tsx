"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

export default function Dashboard() {
  const [memberData, setMemberData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push("/l1/login");
      return;
    }

    async function fetchData() {
      try {
        // Fetch member data
        const storedUserId = sessionStorage.getItem("userId");

        if (!storedUserId) {
          // Redirect to login page if userId is not found
          router.push("/l1/login");
        } else {
          setUserId(storedUserId);
        }
        const memberResponse = await fetch(`/api/l1/dashboard`);
        if (!memberResponse.ok) throw new Error("Failed to fetch member data");

        const memberData = await memberResponse.json();
        setMemberData(memberData);

        // Fetch user data
        const userResponse = await fetch(`/api/l1/userdata/${userId}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        setUserData(userData);
                // Save username to localStorage
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

  return (
    <>
      <Navbar />
      <div className="bg-slate-100 py-6">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-24">
          Dashboard
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
          {memberData.map(
            ({ l1User, l2UserCount, l3UserCount, l4UserCount }) => (
              <div
                key={l1User._id}
                className="flex items-center p-4 bg-white shadow-lg rounded-lg space-x-4 sm:flex-row w-full md:w-auto overflow-x-auto"
              >
                {/* Branch and Peeta Info */}
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    Branch: {l1User.name}
                  </h2>
                  <h2 className="text-lg font-bold text-gray-800">
                    Peeta: {l1User.peeta}
                  </h2>
                </div>

                {/* L1 Users */}
                <div className="p-2 bg-blue-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-blue-800">
                    L1 Users
                  </h3>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {l1User.name}
                  </p>
                </div>

                {/* Arrow */}
                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                {/* L2 Users */}
                <div className="p-2 bg-blue-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-blue-800">
                    L2 Users
                  </h3>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {l2UserCount}
                  </p>
                </div>

                {/* Arrow */}
                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                {/* L3 Users */}
                <div className="p-2 bg-green-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-green-800">
                    L3 Users
                  </h3>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {l3UserCount}
                  </p>
                </div>

                {/* Arrow */}
                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />
                {/* L4 Users */}
                <div className="p-2 bg-green-50 shadow rounded-lg text-center w-44">
                  <h3 className="text-sm font-semibold text-green-800">
                    L4 Users
                  </h3>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {l4UserCount}
                  </p>
                </div>

                {/* Arrow */}
                <img
                  src="https://img.icons8.com/?size=100&id=99982&format=png&color=000000"
                  alt="Arrow Down"
                  className="w-4 h-4"
                />

                {/* Total Users */}
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
          className="flex items-center p-4 shadow-lg relative mx-auto max-w-[90%] sm:max-w-[600px] "
          style={{
            height: "200px",
            backgroundColor: " #ee8628",
          }}
        >
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="Logo" width={90} height={90} />
          </div>
          <div className="ml-4 flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Sanathanaveershivadharma
            </h1>
            <p className="text-white text-sm font-semibold ">
              ------------------
            </p>
            <p className="text-white text-sm">
              Professional description or tagline goes here
            </p>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 sm:top-1/2 sm:right-4 sm:-translate-y-1/2 sm:mt-[0px] mt-[90px]">
            <img
              src={userData.imageUrl}
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
          style={{ height: "300px" }}
        >
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
      }) // Format as dd/mm/yyyy
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
        </div>
        <br />
        <br />
      </div>
      <Footer />
    </>
  );
}
