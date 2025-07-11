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
  contactNo: string;
  dob: string;
  permanentAddress: string | null;
  peeta: string | null;
  selectedL2User: string | null;
  photoUrl: string;
}

export default function Dashboard() {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push("/l3/login");
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

        const memberData = await memberResponse.json();
        setMemberData(memberData);

        const response = await fetch(`/api/l3/dashboard/${userId}?timestamp=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");

        const userData = await response.json();
        setUserData(userData);

        // Store peeta name and username in session storage
        sessionStorage.setItem("peeta", userData.peeta || "");
        sessionStorage.setItem("username", userData.name);
        sessionStorage.setItem("guru", userData.selectedL2User || "");
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }

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
        {/* Responsive Table */}
        <div className="overflow-x-auto mx-auto max-w-[90%] sm:max-w-[95%] mt-10">
          <table className="w-full border-collapse border border-gray-800 bg-white shadow-lg text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-800 p-1 sm:p-2 bg-orange-600 text-white text-center min-w-[120px] h-[150px]">
                  Sri 1008 Jagdguru Peeta श्री 1008 जगद्गुरु पीठ ಶ್ರೀ ೧೦೦೮ ಜಗದ್ಗುರು ಪೀಠ
                </th>
                {memberData.map((member, index) => {
                  // Peeta images and colors as in L2
                  const bgColors = [
                    "bg-green-400",
                    "bg-red-400",
                    "bg-blue-400",
                    "bg-gray-300",
                    "bg-yellow-300",
                    "bg-orange-400",
                  ];
                  const peetaImages: { [key: string]: string } = {
                    "Sri Rambhpuri Peeta श्री रम्भापुरी पीठ ಶ್ರೀ ರಂಭಾಪುರಿ ಪೀಠ": "/img1.jpg",
                    "Sri Ujjayani Peeta श्री उज्जयनी पीठ ಶ್ರೀ ಉಜ್ಜಯನಿ ಪೀಠ": "/img2.jpg",
                    "Sri Kedhara peeta श्री केदारा पीठ ಶ್ರೀ ಕೇದಾರ ಪೀಠ": "/img3.jpg",
                    "Sri SriShaila Peeta श्री श्रीशैल पीठ ಶ್ರೀ ಶ್ರೀಶೈಲ ಪೀಠ": "/img4.jpg",
                    "Sri Kashi Peeta श्री काशी पीठ ಶ್ರೀ ಕಾಶಿ ಪೀಠ": "/img5.jpg",
                    "Sri viraktha parmpare श्री विरक्त  परंपरा ಶ್ರೀ ವಿರಕ್ತ  ಪರಂಪರೆ": "/img6.jpg",
                  };
                  const peetaKey = member.l1User.peeta.trim().toLowerCase();
                  const matchedPeetaKey = Object.keys(peetaImages).find(
                    key => key.trim().toLowerCase() === peetaKey
                  );
                  const imageUrl = matchedPeetaKey ? peetaImages[matchedPeetaKey] : "/img2.jpg";
                  return (
                    <th
                      key={index}
                      className={`border border-gray-800 p-1 sm:p-2 text-center text-white min-w-[120px] h-[150px] ${bgColors[index % bgColors.length]}`}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={imageUrl}
                          alt={member.l1User.peeta}
                          className="rounded-full mb-1 object-cover"
                          style={{ width: "65px", height: "100px" }}
                          onError={(e) => {
                            e.currentTarget.src = "/img2.jpg";
                          }}
                        />
                      </div>
                      <span className="block mt-1 text-sm font-semibold">{member.l1User.peeta}</span>
                    </th>
                  );
                })}
              </tr>
              <tr className="bg-orange-600 text-white">
                <th className="border p-1 sm:p-2 text-left">Peeta</th>
                {memberData.map((member, index) => (
                  <th key={index} className="border p-1 sm:p-2 text-center">L1</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* L2 Row */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L2</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l2UserCount}</td>
                ))}
              </tr>
              {/* L3 Row */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L3</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l3UserCount}</td>
                ))}
              </tr>
              {/* L4 Row */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">L4</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l4UserCount}</td>
                ))}
              </tr>
              {/* Total Row */}
              <tr className="border border-gray-800 bg-orange-100 hover:bg-orange-200 font-bold">
                <td className="border border-gray-800 p-1 sm:p-2 text-center">Total</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l2UserCount + member.l3UserCount}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {/* Total Section (same style as L2) */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <img src="/logomain1.png" style={{ width: "150px", height: "150px" }} />
          <h1 className="font-bold text-black text-lg sm:text-2xl flex items-center"> 
            <strong className="text-6xl sm:text-8xl font-extrabold" style={{ letterSpacing: "5px" }}>→</strong>  
            <span className="ml-4 text-3xl mt-3">Total: {memberData.reduce((acc, member) => acc + member.l2UserCount + member.l3UserCount, 0)}</span>
          </h1>
        </div>
        <br/>
        {/* User Info Section (profile card, as in L2) */}
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
        {/* User Personal Details Card */}
        <div
          className="bg-white p-6 shadow-lg mx-auto mt-4 max-w-[90%] sm:max-w-[500px] rounded-xl bg-yellow-100"
          style={{ marginTop: "-30px", fontSize: "5px" }}
        >
          <div
            className="flex-shrink-0 float-right"
            style={{ marginTop: "10px" }}
          >
            <img
              src={userData.photoUrl ? userData.photoUrl : "/logomain1.png"}
              alt="User"
              className="w-[80px] sm:w-[110px] h-[80px] sm:h-[110px] rounded-full object-cover mb-16 float-right"
              onError={(e) => { e.currentTarget.src = "/logomain1.png"; }}
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
      </div>
      <Footer />
    </>
  );
}
