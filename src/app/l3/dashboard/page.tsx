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
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  // After userData loads, compute completeness
  if (userData && !profileIncomplete) {
    const requiredKeys: (keyof UserData)[] = [
      'dob',
      'permanentAddress',
      'selectedL2User',
      'photoUrl',
    ];
    const missing = requiredKeys.filter((k) => {
      const v = userData[k];
      return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    });
    if (missing.length > 0 && !profileIncomplete) {
      setProfileIncomplete(true);
    }
  }

  // Determine missing fields against full L3 field set (from translations signupl3)
  useEffect(() => {
    if (!userData) return;
    const ALL_L3_FIELDS: string[] = [
      'dob','gender','mailId','karthruGuru','peeta','bhage','gothra','nationality','presentAddress','permanentAddress','qualification','occupation','languageKnown','selectedL2User','photoUrl'
    ];
    const userRecord = userData as unknown as Record<string, unknown>;
    const missing: string[] = ALL_L3_FIELDS.filter((k) => {
      const v = userRecord[k];
      return v === undefined || v === null || (typeof v === 'string' && (v as string).trim() === '');
    });
    setMissingFields(missing);
    const preset: Record<string, string> = {};
    missing.forEach((k) => {
      preset[k] = '';
    });
    setFormData(preset);
  }, [userData]);

  // Immediate prompt; no delay

  if (memberData.length === 0 || !userData) return <p>Loading...</p>;

  // Precompute totals across peetas like L2
  const l2TotalAll = memberData.reduce((sum, m) => sum + (m.l2UserCount ?? 0), 0);
  const l3TotalAll = memberData.reduce((sum, m) => sum + (m.l3UserCount ?? 0), 0);
  const l4TotalAll = memberData.reduce((sum, m) => sum + (m.l4UserCount ?? 0), 0);
  const grandTotalAll = l2TotalAll + l3TotalAll + l4TotalAll;

  return (
    <>
      <Navbar />
      <div className="bg-slate-100 pt-4 sm:pt-6">
        {profileIncomplete && (
          <div className="mx-auto max-w-[90%] sm:max-w-[95%] mt-0 mb-2 p-3 rounded bg-yellow-100 text-yellow-900 flex items-center justify-between shadow">
            <span>Your profile is incomplete. Please fill the remaining details.</span>
            <div className="flex gap-2">
              <button onClick={() => setShowCompleteForm(true)} className="bg-green-600 text-white px-3 py-1 rounded">Complete Now</button>
            </div>
          </div>
        )}
        {showCompleteForm && profileIncomplete && missingFields.length > 0 && (
          <div className="fixed inset-0 flex items-start justify-center pt-24 pointer-events-none">
            <div className="relative z-[60] bg-white rounded-lg shadow-lg w-[95%] max-w-2xl p-5 pointer-events-auto">
             
              {(() => {
                const perStep = 5;
                const totalSteps = Math.ceil(missingFields.length / perStep);
                const start = currentStep * perStep;
                const end = start + perStep;
                const fieldsForStep = missingFields.slice(start, end);
                return (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const stored = (typeof window !== 'undefined') ? (sessionStorage.getItem('userId') || '') : '';
                        const userId = stored;
                        const payload: Record<string, string> = {};
                        missingFields.forEach((k) => { if (formData[k] !== undefined && formData[k] !== '') payload[k] = formData[k]; });
                        const res = await fetch(`/api/l3/update-profile/${userId}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.message || 'Failed to update');
                        alert('Profile updated');
                        const refreshed = await fetch(`/api/l3/dashboard/${userId}?timestamp=${Date.now()}`, { cache: 'no-store' });
                        if (refreshed.ok) {
                          const ud = await refreshed.json();
                          setUserData(ud);
                          setProfileIncomplete(false);
                          setMissingFields([]);
                          setFormData({});
                          setShowCompleteForm(false);
                          setCurrentStep(0);
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Error saving details');
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {fieldsForStep.map((field) => (
                      <div key={field} className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1 capitalize">{field}</label>
                        {field === 'dob' ? (
                          <input type="date" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" />
                        ) : field === 'gender' ? (
                          <select value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : field.toLowerCase().includes('address') ? (
                          <textarea value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" rows={2} />
                        ) : (
                          <input type="text" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" />
                        )}
                      </div>
                    ))}
                    <div className="sm:col-span-2 flex justify-between mt-2">
                      <button type="button" onClick={() => setShowCompleteForm(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Close</button>
                      <div className="flex gap-2">
                        <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} className={`px-4 py-2 rounded ${currentStep === 0 ? 'bg-gray-300 text-gray-400' : 'bg-blue-100 text-blue-800'}`}>Back</button>
                        {currentStep < Math.ceil(missingFields.length / perStep) - 1 ? (
                          <button type="button" onClick={() => setCurrentStep((s) => s + 1)} className="px-4 py-2 rounded bg-blue-600 text-white">Next</button>
                        ) : (
                          <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-2 text-right text-sm text-gray-500">Step {currentStep + 1} of {totalSteps}</div>
                  </form>
                );
              })()}
            </div>
          </div>
        )}
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
                  const bgColors = [
                    "bg-green-400",
                    "bg-red-400",
                    "bg-blue-400",
                    "bg-gray-300",
                    "bg-yellow-300",
                    "bg-orange-400",
                  ];
                  // More robust image selection using substring matching on normalized name
                  const norm = (s: string) => s
                    .toLowerCase()
                    .normalize('NFKD')
                    .replace(/[^a-z]/g, '');
                  const peetaNorm = norm(member.l1User.peeta || '');
                  const peetaImageBySubstring: { key: string; img: string }[] = [
                    { key: 'rambh', img: '/img1.jpg' },
                    { key: 'ujjay', img: '/img2.jpg' },
                    { key: 'kedhar', img: '/img3.jpg' },
                    { key: 'srishail', img: '/img4.jpg' },
                    { key: 'kashi', img: '/img5.jpg' },
                    { key: 'virakth', img: '/img6.jpg' },
                  ];
                  const matched = peetaImageBySubstring.find(({ key }) => peetaNorm.includes(key));
                  const imageUrl = matched ? matched.img : '/img2.jpg';
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
                <th className="border border-gray-800 p-1 sm:p-2 bg-yellow-600 text-white text-center min-w-[80px]">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* L2 Row - counts */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">Sri 108 Prabhu shivachrya</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l2UserCount ?? 0}</td>
                ))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l2TotalAll}</td>
              </tr>
              {/* L3 Row - counts */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">Sri guru Jangam</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l3UserCount ?? 0}</td>
                ))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l3TotalAll}</td>
              </tr>
              {/* L4 Row - counts */}
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">Sri Veerashiva</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l4UserCount ?? 0}</td>
                ))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l4TotalAll}</td>
              </tr>
              {/* Total Row */}
              <tr className="border border-gray-800 bg-orange-100 hover:bg-orange-200 font-bold">
                <td className="border border-gray-800 p-1 sm:p-2 text-center">Total</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{(member.l2UserCount ?? 0) + (member.l3UserCount ?? 0) + (member.l4UserCount ?? 0)}</td>
                ))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center">{grandTotalAll}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Total Section (same style as L2) */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <img src="/logomain1.png" style={{ width: "150px", height: "150px" }} />
          <h1 className="font-bold text-black text-lg sm:text-2xl flex items-center"> 
            <strong className="text-6xl sm:text-8xl font-extrabold" style={{ letterSpacing: "5px" }}>→</strong>  
            <span className="ml-4 text-3xl mt-3">Total: {grandTotalAll}</span>
          </h1>
        </div>
        <br/>
        {/* Custom Card Layout for L3 */}
        <div className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-6">
          <div className="flex flex-col sm:flex-row justify-center gap-8">
           
            <div
              className="w-[85mm] h-[55mm] mx-auto"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              <div
                className="rounded-xl w-full h-full shadow-lg overflow-hidden relative"
                style={{ backgroundColor: '#fff', color: '#000' }}
              >
             
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
                    <p className="text-sm font-semibold "></p>
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
                  {/* <span className="text-xs font-semibold">Guru Address: {userData.address || 'N/A'}</span> */}
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
                    
                      {/* <p className="text-xs font-semibold"><span className="font-bold">Bhage:</span> <span className="font-normal">Panchavarna</span></p> */}
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
