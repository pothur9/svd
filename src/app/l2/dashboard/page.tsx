"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
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
  const [total, setTotal] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      router.push("/l2/login");
      return;
    }

    const fetchMemberData = async () => {
      try {
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
        console.log('Fetched memberData:', memberData); // Debug log
        setMemberData(memberData);

        const userResponse = await fetch(`/api/l2/dashboard/${userId}?timestamp=${Date.now()}`, {
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
          // Calculate total user count
          const totalUsers = memberData.reduce((acc, member) => {
            return (
              acc + member.l2UserCount + member.l3UserCount + member.l4UserCount
            );
          }, 0);
          setTotal(totalUsers);
  

        // Store peeta name and username in session storage
        sessionStorage.setItem("peeta", userData.peeta || "");
        sessionStorage.setItem("username", userData.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMemberData();

    // Responsive check for mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  if (memberData.length === 0 || !userData) {
    if (memberData.length === 0) {
      console.warn('memberData is empty after fetch!');
    }
    return <p>Loading...</p>;
  }
  // Define background colors for peetas in a repeating pattern
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
  console.log(total)
  
  // Helper to get the card preview URL for the current user
  const getCardPreviewUrl = () => {
    // You should create a dedicated card preview page for this, e.g. /l2/card-preview?userId=...
    // For now, we'll use the dashboard URL as a placeholder, but ideally this should render only the card
    if (typeof window !== 'undefined') {
      const userId = sessionStorage.getItem('userId');
      // Change this to your actual card preview route if you have one
      return `${window.location.origin}/l2/card-preview?userId=${userId}`;
    }
    return '';
  };

  const downloadUserCard = async () => {
    if (isDownloading) return; // Prevent multiple simultaneous downloads
    
    setIsDownloading(true);
    try {
      const cardUrl = getCardPreviewUrl();
      if (!cardUrl) throw new Error('Card preview URL not found');
      const response = await fetch(`/api/generate-card-pdf?cardUrl=${encodeURIComponent(cardUrl)}`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userData?.name || 'card'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper for mobile: get user counts for a member
  const getUserCounts = (member: MemberData) => [
    member.l2UserCount ?? 0,
    member.l3UserCount ?? 0,
    member.l4UserCount ?? 0,
    (member.l2UserCount ?? 0) + (member.l3UserCount ?? 0) + (member.l4UserCount ?? 0)
  ];
  const userTypeFullLabels = [
    'Sri 108 Prabhu shivachrya',
    'Sri guru Jangam',
    'Sri Veerashiva',
    'Total',
  ];

  return (
    <>
      <Navbar />
      <div className="bg-slate-100 py-6">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-24">
          Dashboard
        </h1>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="relative w-[250px] h-[250px]">
            <Image
              src="/count.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          
        </div>
        {/* Responsive Table */}
        <div className="overflow-x-auto mx-auto max-w-[90%] sm:max-w-[95%] mt-10">
          {/* Desktop Table */}
          {!isMobile && (
            <table className="w-full border-collapse border border-gray-800 bg-white shadow-lg text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-800 p-1 sm:p-2 bg-orange-600 text-white text-center min-w-[120px] h-[150px]">
                    Sri 1008 Jagdguru Peeta श्री 1008 जगद्गुरु पीठ ಶ್ರೀ ೧೦೦೮ ಜಗದ್ಗುರು ಪೀಠ
                  </th>

                  {memberData.map((member, index) => {
                    // Modify the image matching logic
                    const peetaKey = member.l1User.peeta.trim().toLowerCase();
                    console.log('Original Peeta:', member.l1User.peeta);
                    console.log('Processed Peeta Key:', peetaKey);
                    console.log('Available Peeta Image Keys:', Object.keys(peetaImages));
                    
                    const matchedPeetaKey = Object.keys(peetaImages).find(
                      key => key.trim().toLowerCase() === peetaKey
                    );
                    
                    console.log('Matched Peeta Key:', matchedPeetaKey);
                    const imageUrl = matchedPeetaKey ? peetaImages[matchedPeetaKey] : "/img2.jpg";
                    console.log('Image URL:', imageUrl);

                    return (
                      <th
                        key={index}
                        className={`border border-gray-800 p-1 sm:p-2 text-center text-white min-w-[120px] h-[150px] ${
                          bgColors[index % bgColors.length]
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="relative w-[65px] h-[100px]">
                            <Image
                              src={imageUrl}
                              alt={member.l1User.peeta}
                              fill
                              className="rounded-full mb-1 object-cover"
                              onError={(e) => {
                                // @ts-expect-error - next/image doesn't properly type onError event
                                e.target.src = "/img2.jpg";
                              }}
                            />
                          </div>
                        </div>
                        <span className="block mt-1 text-sm font-semibold">{member.l1User.peeta}</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {/* L2 Row - User Counts */}
                <tr className="border border-gray-800 hover:bg-yellow-100">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">
                    Sri 108 Prabhu shivachrya
                    <br />
                    श्री 108 प्रभु शिवाचार्य
                    <br />
                    ಶ್ರೀ 108 ಪ್ರಭು ಶಿವಾಚಾರ್ಯರು
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {member.l2UserCount ?? 0}
                    </td>
                  ))}
                </tr>

                {/* L3 Row - User Counts */}
                <tr className="border border-gray-800 hover:bg-yellow-100">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">
                    Sri guru Jangam
                    <br />
                    श्री गुरु जंगम
                    <br />
                    ಶ್ರೀ ಗುರು ಜಂಗಮ
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {member.l3UserCount ?? 0}
                    </td>
                  ))}
                </tr>

                {/* L4 Row - User Counts */}
                <tr className="border border-gray-800 hover:bg-yellow-100">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">
                    Sri Veerashiva
                    <br />
                    श्री वीरशिव
                    <br />
                    ಶ್ರೀ ವೀರಶೈವ
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {member.l4UserCount ?? 0}
                    </td>
                  ))}
                </tr>

                {/* Total Row */}
                <tr className="border border-gray-800 bg-orange-100 hover:bg-orange-200 font-bold">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center">
                    Total
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {(member.l2UserCount ?? 0) +
                        (member.l3UserCount ?? 0) +
                        (member.l4UserCount ?? 0)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
          {/* Mobile Table (Transposed) */}
          {isMobile && (
            <table className="w-full table-fixed border-collapse border border-gray-800 bg-white shadow-lg text-xs">
              <thead>
                <tr>
                  <th className="border border-gray-800 p-1 bg-orange-600 text-white text-center w-1/4 min-w-[60px]">Peeta</th>
                  {userTypeFullLabels.map((label) => (
                    <th key={label} className="border border-gray-800 p-1 bg-yellow-100 text-center w-1/5 min-w-[70px]">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberData.map((member, index) => {
                  const peetaKey = member.l1User.peeta.trim().toLowerCase();
                  const matchedPeetaKey = Object.keys(peetaImages).find(
                    key => key.trim().toLowerCase() === peetaKey
                  );
                  const imageUrl = matchedPeetaKey ? peetaImages[matchedPeetaKey] : "/img2.jpg";
                  const counts = getUserCounts(member);
                  return (
                    <tr key={index}>
                      <td className={`border border-gray-800 p-1 text-center font-semibold ${bgColors[index % bgColors.length]} w-1/4 align-middle`} style={{fontSize:'0.7rem', minHeight: '48px', paddingTop: '6px'}}>
                        <div className="flex flex-col items-start h-full">
                          <div className="relative w-[32px] h-[32px] mb-1">
                            <Image src={imageUrl} alt={member.l1User.peeta} fill className="rounded-full object-cover object-top" />
                          </div>
                          <span className="block text-[10px] break-words whitespace-normal leading-snug min-h-[24px] text-left" style={{wordBreak: 'break-word'}}>{member.l1User.peeta}</span>
                        </div>
                      </td>
                      {counts.map((count, i) => (
                        <td key={i} className="border border-gray-800 p-1 text-center w-1/5" style={{fontSize:'0.8rem'}}>{count}</td>
                      ))}
                    </tr>
                  );
                })}
                {/* Column Totals Row */}
                <tr className="bg-orange-100 font-bold">
                  <td className="border border-gray-800 p-1 text-center">Total</td>
                  {(() => {
                    // Calculate totals for each user type column
                    const totals = [0, 0, 0, 0];
                    memberData.forEach(member => {
                      const counts = getUserCounts(member);
                      counts.forEach((count, i) => { totals[i] += count; });
                    });
                    return totals.map((total, i) => (
                      <td key={i} className="border border-gray-800 p-1 text-center w-1/5">{total}</td>
                    ));
                  })()}
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="relative w-[150px] h-[150px]">
            <Image
              src="/logomain1.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-bold text-black text-lg sm:text-2xl flex items-center">
            <strong className="text-6xl sm:text-8xl font-extrabold" style={{ letterSpacing: "5px" }}>
              →
            </strong>
            <span className="ml-4 text-3xl mt-3">Total: {total}</span>
          </h1>
        </div>
        <div>
          {/* User Info Section - Cards Container */}
          <div className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-6">
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              {/* Front Card */}
              <div
                className="w-[85mm] h-[55mm] mx-auto"
                ref={frontCardRef}
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                <div
                  className="rounded-xl w-full h-full shadow-lg overflow-hidden"
                  style={{ backgroundColor: '#fff', color: '#000' }}
                >
                  {/* Orange Header Section */}
                  <div
                    className="p-3 flex items-center"
                    style={{ backgroundColor: '#ea580c', color: '#fff' }}
                  >
                    <div className="relative w-[40px] h-[40px]">
                      <Image
                        src="/logomain1.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
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
                      <p className="text-sm font-semibold mb-1" style={{ color: '#000', backgroundColor: '#fff' }}>Name: {userData.name}</p>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#000', backgroundColor: '#fff' }}>ID: {userData.userId}</p>
                      <p className="text-sm font-semibold" style={{ color: '#000', backgroundColor: '#fff' }}>Peeta: {userData.peeta || "N/A"}</p>
                      <p className="text-sm font-semibold" style={{ color: '#000', backgroundColor: '#fff' }}>Phone: {userData.contactNo}</p>
                    </div>
                    
                    {/* Right side - Image and QR Code */}
                    <div className="flex flex-col items-center" style={{ backgroundColor: '#fff' }}>
                      <div className="relative w-[80px] h-[80px] -mt-6" style={{ backgroundColor: '#fff' }}>
                        <Image
                          src={userData.imageUrl && userData.imageUrl.startsWith("http") ? userData.imageUrl : "/default-avatar.jpg"}
                          alt={`${userData.name}'s profile`}
                          fill
                          className="rounded-md object-cover border-2"
                          style={{ borderColor: '#ea580c', backgroundColor: '#fff' }}
                          onError={(e) => {
                            // @ts-expect-error - next/image doesn't properly type onError event
                            e.target.src = "/default-avatar.jpg";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Card */}
              <div
                className="w-[85mm] h-[55mm] mx-auto"
                ref={backCardRef}
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
                <div
                  className="rounded-xl w-full h-full shadow-lg overflow-hidden relative"
                  style={{ backgroundColor: '#fff', color: '#000' }}
                >
                  {/* Orange Header Section (same as front) */}
                  <div
                    className="p-3 flex items-center z-10 relative"
                    style={{ backgroundColor: '#ea580c', color: '#fff' }}
                  ></div>
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
                                              zIndex: 50,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Image
                      src="/logomain1.png"
                      alt="Logo Watermark"
                      fill
                      className="object-contain"
                      style={{ 
                        opacity: 0.20, 
                        backgroundColor: 'transparent',
                        maxWidth: '70%',
                        maxHeight: '70%'
                      }}
                    />
                  </div>
                  {/* Content Section (above watermark) */}
                  <div
                    className="px-5 pb-5 pt-0 w-full h-full z-10 relative flex flex-row items-center justify-between"
                    style={{ backgroundColor: '#fff', color: '#000' }}
                  >
                    <div className="flex-1" style={{ backgroundColor: '#fff', color: '#000' }}>
                      <div className="grid grid-cols-1 gap-2" style={{ backgroundColor: '#fff', color: '#000' }}>
                        <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff' }}>DOB: {
                          userData.dob && !isNaN(Date.parse(userData.dob))
                            ? new Date(userData.dob).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "N/A"
                        }</p>
                       
                        <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff' }}>Guru: {userData.dhekshaGuru || "N/A"}</p>
                        <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff' }}>Address: {userData.address || "N/A"}</p>
                      </div>
                    </div>
                    {/* QR Code for back side, right side */}
                    <div className="flex items-center justify-end ml-4" style={{ backgroundColor: '#fff' }}>
                      <QRCodeSVG
                        value={JSON.stringify({
                          name: userData.name,
                          id: userData.userId,
                          peeta: userData.peeta,
                          dob: userData.dob,
                          phone: userData.contactNo,
                          guru: userData.dhekshaGuru
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
           
           {/* Download Button */}
           <div className="flex justify-center mt-6">
             <button
               onClick={downloadUserCard}
               disabled={isDownloading}
               style={{
                 backgroundColor: isDownloading ? '#9ca3af' : '#ea580c',
                 color: '#ffffff',
                 padding: '0.5rem 1.5rem',
                 borderRadius: '0.5rem',
                 cursor: isDownloading ? 'not-allowed' : 'pointer',
                 border: 'none',
                 fontWeight: 'bold',
                 transition: 'background-color 0.3s ease',
                 opacity: isDownloading ? 0.7 : 1,
               }}
               onMouseOver={(e) => {
                 if (!isDownloading) {
                   e.currentTarget.style.backgroundColor = '#c2410c';
                 }
               }}
               onMouseOut={(e) => {
                 if (!isDownloading) {
                   e.currentTarget.style.backgroundColor = '#ea580c';
                 }
               }}
             >
               {isDownloading ? (
                 <div className="flex items-center gap-2">
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                   Generating PDF...
                 </div>
               ) : (
                 'Download ID Card as PDF'
               )}
             </button>
           </div>
         </div>
       </div>
       <Footer />
     </>
   );
 }
