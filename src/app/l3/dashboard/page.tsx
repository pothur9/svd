"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { QRCodeSVG } from "qrcode.react";
import AuthManager from "../../../lib/auth";

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
  _id?: string;
  name: string;
  userId: string;
  contactNo: string;
  dob: string;
  permanentAddress: string | null;
  peeta: string | null;
  selectedL2User: string | null;
  photoUrl: string;
  karthruGuru?: string | null;
  bhage?: string | null;
  gothra?: string | null;
  kula?: string | null;
  nakshatra?: string | null;
  presentAddress?: string | null;
  gender?: string | null;
  mailId?: string | null;
  nationality?: string | null;
  qualification?: string | null;
  occupation?: string | null;
  languageKnown?: string | null;
  married?: string | null;
  higherDegree?: string | null;
}

export default function Dashboard() {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Check authentication using AuthManager
    if (!AuthManager.isAuthenticated()) {
      router.replace("/l3/login");
      return;
    }

    const userId = AuthManager.getCurrentUserId();
    if (!userId) {
      router.replace("/l3/login");
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

        // Store additional data in session storage for legacy compatibility
        if (userId) {
          sessionStorage.setItem("userId", userId);
        }
        sessionStorage.setItem("peeta", userData.peeta || "");
        sessionStorage.setItem("username", userData.name);
        sessionStorage.setItem("guru", userData.selectedL2User || "");
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }

    fetchMemberData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l2UserCount + member.l3UserCount + member.l4UserCount}</td>
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
            <span className="ml-4 text-3xl mt-3">Total: {memberData.reduce((acc, member) => acc + member.l2UserCount + member.l3UserCount + member.l4UserCount, 0)}</span>
          </h1>
        </div>
        <br/>
        {/* Custom Card Layout for L3 */}
        <div className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-6">
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            {/* Front Card */}
            <div
              className="w-[85mm] h-[55mm] mx-auto"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              <div
                className="rounded-xl w-full h-full shadow-lg overflow-hidden relative"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                {/* Watermark Logo */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 0,
                    backgroundColor: 'transparent',
                  }}
                >
                  <img
                    src="/logomain1.png"
                    alt="Logo Watermark"
                    style={{
                      opacity: 0.15,
                      maxWidth: '70%',
                      maxHeight: '70%',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                {/* Orange Header Section */}
                <div
                  className="p-3 flex items-center"
                  style={{ backgroundColor: '#ea580c', color: '#fff' }}
                >
                  <img
                    src="/logomain1.png"
                    alt="Logo"
                    className="object-contain w-[50px] h-[50px]"
                  />
                  <h1
                    className="text-sm font-bold ml-2"
                    style={{ color: '#fff', backgroundColor: '#ea580c' }}
                  >
                    Sanathana Veera Shiva <br/>Lingayatha Dharma
                  </h1>
                </div>
                {/* Content Section */}
                <div
                  className="p-3 flex justify-between"
                  style={{ backgroundColor: '#fff', color: '#000' }}
                >
                  {/* Left side - Text */}
                  <div className="text-black" style={{ color: '#000', backgroundColor: '#fff' }}>
                    <p className="text-sm font-semibold ">Name: {userData.name}</p>
                    <p className="text-sm font-semibold ">S/o: M.Karibasayya swamy</p>
                    <p className="text-sm font-semibold ">Peeta: {userData.peeta || 'N/A'}</p>
                    <p className="text-sm font-semibold ">DOB: {userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A"}</p>
                    <p className="text-sm font-semibold">Phone: {userData.contactNo}</p>
                    <p className="text-sm font-semibold">Gotra:{userData.gothra || 'N/A'}</p>
                  </div>
                  {/* Right side - Image */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-[80px] h-[80px] -mt-6">
                      <img
                        src={userData.photoUrl && userData.photoUrl.startsWith("http") ? userData.photoUrl : "/default-avatar.jpg"}
                        alt={`${userData.name}'s profile`}
                        className="rounded-md object-cover border-2 w-full h-full"
                        style={{ borderColor: '#ea580c', backgroundColor: '#fff' }}
                        onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; }}
                      />
                    </div>
                    {/* E-KYC pending vertical text */}
                    <div style={{ color: 'red', fontWeight: 'bold', marginTop: '8px', letterSpacing: '2px', fontSize: '10px' }}>
                      E-KYC pending
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Back Card */}
            <div
              className="w-[85mm] h-[55mm] mx-auto"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              <div
                className="rounded-xl w-full h-full shadow-lg overflow-hidden relative"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                {/* Red Ribbon Guru Section */}
                <div
                  className="p-3 flex flex-col   z-10 relative"
                  style={{ backgroundColor: '#ea580c', color: '#fff' }}
                >
                  <span className="text-xs font-semibold w-full break-words">Guru: {userData.selectedL2User || 'N/A'}</span>
                  <span className="text-xs font-semibold">Guru Address:  ಹರಗಿನ ದೋಣಿ. ಬಳ್ಳಾರಿ ಜಿ</span>
                </div>
                {/* Content Section (below ribbon) */}
                <div
                  className="px-5 pb-5 pt-2 w-full h-full z-10 relative flex flex-row items-center justify-between"
                  style={{ backgroundColor: '#fff', color: '#000' }}
                >
                  {/* Left side: details */}
                  <div className="flex-1" style={{ backgroundColor: '#fff', color: '#000' }}>
                    <div className="grid grid-cols-1 gap-0.5" style={{ backgroundColor: '#fff', color: '#000', marginTop:"-55px"}} >
                   
                      <p className="text-xs font-semibold"><span className="font-bold">Kula:</span> <span className="font-normal">{userData.kula || 'N/A'}</span></p>
                    
                      <p className="text-xs font-semibold"><span className="font-bold">Bhage:</span> <span className="font-normal">Panchavarna</span></p>
                      {/* <p className="text-xs font-semibold"><span className="font-bold">Nakshatra:</span> <span className="font-normal">{userData.nakshatra || 'N/A'}</span></p> */}
                      <p className="text-xs font-semibold"><span className="font-bold">Permanent Address:</span> <span className="font-normal">{userData.permanentAddress || 'N/A'}</span></p>
                    </div>
                  </div>
                  {/* Right side: QR code */}
                  <div className="flex items-center justify-end ml-4" style={{ backgroundColor: '#fff', marginTop:"-60px"}}>
                    <QRCodeSVG
                      value={JSON.stringify({
                        name: userData.name,
                        id: userData.userId,
                        phone: userData.contactNo,
                        dob: userData.dob,
                        guru: userData.selectedL2User,
                      })}
                      size={130}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
      <Footer />
    </>
  );
}
