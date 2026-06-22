"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import AuthManager from "../../../lib/auth";
import Navbar from "../navbar/page";
import Footer from "../footer/page";
import CenteredLoader from "../../../components/CenteredLoader";
import Toast from "../../../components/Toast";


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
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [selIdx, setSelIdx] = useState(0);
  const [l2CardSide, setL2CardSide] = useState<'front' | 'back'>('front');
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "bonus" } | null>(null);


  useEffect(() => {
    // Early auth check using localStorage via AuthManager
    if (!AuthManager.isAuthenticated()) {
      router.push("/l2/login");
      return;
    }

    const currentUser = AuthManager.getAuthUser();
    const userId = currentUser?.userId;

    if (!userId) {
      router.push("/l2/login");
      return;
    }

    if (sessionStorage.getItem("showWelcomeBonus") === "true") {
      setToast({
        message: "Welcome! 🎉\n500 Rudhars have been added to your wallet!",
        type: "bonus",
      });
      sessionStorage.removeItem("showWelcomeBonus");
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
        if (!userResponse.ok) {
          // If user not found, direct the user to signup
          if (userResponse.status === 404) {
            setError("Please signup first to login.");
            router.push("/l2/signup");
            return;
          }
          throw new Error("Failed to fetch user data");
        }

        const userData: UserData = await userResponse.json();
        setUserData(userData);
        // Check for missing mandatory fields to complete profile
        const requiredKeys: (keyof UserData)[] = [
          'dob',
          'address',
          'dhekshaGuru',
          'peeta', // ensure peeta present too
          'imageUrl',
        ];
        const missing = requiredKeys.filter(k => !userData[k] || (typeof userData[k] === 'string' && (userData[k] as unknown as string).trim() === ''));
        if (missing.length > 0) {
          setProfileIncomplete(true);
        }
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
        sessionStorage.setItem("userId", userData.userId);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchMemberData();

    // Responsive check for mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    setAuthChecked(true);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  // If profile is incomplete, show a prompt after 30 seconds
  useEffect(() => {
    if (!profileIncomplete) return;
    const t = setTimeout(() => setShowProfilePrompt(true), 30000);
    return () => clearTimeout(t);
  }, [profileIncomplete]);

  // Block rendering until we verify auth state to prevent flicker
  if (!authChecked) {
    return <CenteredLoader message="Checking session..." />;
  }

  if (memberData.length === 0 || !userData) {
    if (memberData.length === 0) {
      console.warn('memberData is empty after fetch!');
    }
    return <CenteredLoader message={error ? error : 'Loading...'} />;
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
    "Sri Rambhpuri Peeta Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤Â°Ã Â¤Â®Ã Â¥ÂÃ Â¤Â­Ã Â¤Â¾Ã Â¤ÂªÃ Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤ÂªÃ Â¥â‚¬Ã Â¤Â  Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²Â°Ã Â²â€šÃ Â²Â­Ã Â²Â¾Ã Â²ÂªÃ Â³ÂÃ Â²Â°Ã Â²Â¿ Ã Â²ÂªÃ Â³â‚¬Ã Â²Â ": "/img1.jpg",
    "Sri Ujjayani Peeta Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤â€°Ã Â¤Å“Ã Â¥ÂÃ Â¤Å“Ã Â¤Â¯Ã Â¤Â¨Ã Â¥â‚¬ Ã Â¤ÂªÃ Â¥â‚¬Ã Â¤Â  Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²â€°Ã Â²Å“Ã Â³ÂÃ Â²Å“Ã Â²Â¯Ã Â²Â¨Ã Â²Â¿ Ã Â²ÂªÃ Â³â‚¬Ã Â²Â ": "/img2.jpg",
    "Sri Kedhara peeta Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤â€¢Ã Â¥â€¡Ã Â¤Â¦Ã Â¤Â¾Ã Â¤Â°Ã Â¤Â¾ Ã Â¤ÂªÃ Â¥â‚¬Ã Â¤Â  Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²â€¢Ã Â³â€¡Ã Â²Â¦Ã Â²Â¾Ã Â²Â° Ã Â²ÂªÃ Â³â‚¬Ã Â²Â ": "/img3.jpg",
    "Sri SriShaila Peeta Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬Ã Â¤Â¶Ã Â¥Ë†Ã Â¤Â² Ã Â¤ÂªÃ Â¥â‚¬Ã Â¤Â  Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬Ã Â²Â¶Ã Â³Ë†Ã Â²Â² Ã Â²ÂªÃ Â³â‚¬Ã Â²Â ": "/img4.jpg",
    "Sri Kashi Peeta Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤â€¢Ã Â¤Â¾Ã Â¤Â¶Ã Â¥â‚¬ Ã Â¤ÂªÃ Â¥â‚¬Ã Â¤Â  Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²â€¢Ã Â²Â¾Ã Â²Â¶Ã Â²Â¿ Ã Â²ÂªÃ Â³â‚¬Ã Â²Â ": "/img5.jpg",
    "Sri viraktha parmpare Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤ÂµÃ Â¤Â¿Ã Â¤Â°Ã Â¤â€¢Ã Â¥ÂÃ Â¤Â¤  Ã Â¤ÂªÃ Â¤Â°Ã Â¤â€šÃ Â¤ÂªÃ Â¤Â°Ã Â¤Â¾ Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²ÂµÃ Â²Â¿Ã Â²Â°Ã Â²â€¢Ã Â³ÂÃ Â²Â¤  Ã Â²ÂªÃ Â²Â°Ã Â²â€šÃ Â²ÂªÃ Â²Â°Ã Â³â€ ": "/img6.jpg",
  };
  console.log(total)
  // Precompute overall totals across all peetas for desktop table totals column
  const l2TotalAll = memberData.reduce((sum, m) => sum + (m.l2UserCount ?? 0), 0);
  const l3TotalAll = memberData.reduce((sum, m) => sum + (m.l3UserCount ?? 0), 0);
  const l4TotalAll = memberData.reduce((sum, m) => sum + (m.l4UserCount ?? 0), 0);
  const grandTotalAll = l2TotalAll + l3TotalAll + l4TotalAll;
  
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
      console.log('Failed to generate PDF.');
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

  // Add logout function
  const handleLogout = () => {
    AuthManager.logout();
    router.push("/l2/login");
  };

  const goToCompleteProfile = () => {
    router.push("/l2/complete-profile");
  };

  const peethaColors = [
    { bg: '#fef3c7', text: '#92400e' },
    { bg: '#ede9fe', text: '#5b21b6' },
    { bg: '#e0f2fe', text: '#075985' },
    { bg: '#fce7f3', text: '#9d174d' },
    { bg: '#dcfce7', text: '#166534' },
    { bg: '#fee2e2', text: '#991b1b' },
  ];
  const normStr = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z]/g, '');
  const peetaImageBySubstring: { key: string; img: string }[] = [
    { key: 'rambh', img: '/img1.jpg' },
    { key: 'ujjay', img: '/img2.jpg' },
    { key: 'kedhar', img: '/img3.jpg' },
    { key: 'srishail', img: '/img4.jpg' },
    { key: 'kashi', img: '/img5.jpg' },
    { key: 'virakth', img: '/img6.jpg' },
  ];

  // â”€â”€ MOBILE LAYOUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (isMobile) {
    const selMember = memberData[selIdx] ?? null;
    const selTotal = selMember
      ? (selMember.l2UserCount ?? 0) + (selMember.l3UserCount ?? 0) + (selMember.l4UserCount ?? 0)
      : 0;
    return (
      <>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <Navbar />

        <style jsx global>{`
          @keyframes l2fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes l2heroPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.04); } }
          @keyframes l2badgePop { 0%{ transform:scale(0.6); opacity:0; } 70%{ transform:scale(1.12); } 100%{ transform:scale(1); opacity:1; } }
          .l2a0 { animation:l2fadeUp 0.4s ease both; }
          .l2a1 { animation:l2fadeUp 0.4s 0.06s ease both; }
          .l2a2 { animation:l2fadeUp 0.4s 0.12s ease both; }
          .l2a3 { animation:l2fadeUp 0.4s 0.18s ease both; }
          .l2a4 { animation:l2fadeUp 0.4s 0.24s ease both; }
          .l2hero { animation:l2heroPulse 3s ease-in-out infinite; }
          .l2badge { animation:l2badgePop 0.5s 0.4s ease both; opacity:0; animation-fill-mode:both; }
          .l2card { background:#fff; border:1px solid #f1f5f9; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
          .l2lbl { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#94a3b8; margin:0 0 10px; }
          .l2chip { flex:1; background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; padding:12px 8px; display:flex; flex-direction:column; align-items:center; gap:3px; }
          .l2scroll { display:flex; gap:8px; overflow-x:auto; padding:4px 0 8px; scrollbar-width:none; }
          .l2scroll::-webkit-scrollbar { display:none; }
          .l2pbtn { display:flex; flex-direction:column; align-items:center; gap:5px; min-width:72px; padding:10px 6px; background:#fff; border:1.5px solid #f1f5f9; border-radius:14px; cursor:pointer; transition:border-color 0.2s,transform 0.15s; }
          .l2pbtn:active { transform:scale(0.95); }
          .l2pbtn.active { border-color:#ea580c; box-shadow:0 2px 8px rgba(234,88,12,0.2); }
          .l2tbl { width:100%; border-collapse:collapse; font-size:13px; }
          .l2tbl th { background:#f8fafc; padding:7px 10px; font-size:11px; font-weight:600; color:#64748b; text-align:left; }
          .l2tbl td { padding:9px 10px; border-bottom:1px solid #f1f5f9; color:#1e293b; }
          .l2tbl tr:last-child td { border-bottom:none; font-weight:600; }
        `}</style>

        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
          {profileIncomplete && showProfilePrompt && (
            <div className="l2a0" style={{ margin: '12px 16px 0', background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '3px solid #f59e0b', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>âš ï¸</span>
              <span style={{ fontSize: '13px', color: '#78350f', flex: 1 }}>Profile incomplete</span>
              <button onClick={goToCompleteProfile} style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Fill now</button>
            </div>
          )}

          <div style={{ padding: '16px 16px 0' }}>
            {/* Hero Card */}
            <div className="l2a0" style={{ background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)', borderRadius: '20px', padding: '18px 16px', color: '#fff', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                <div className="l2hero" style={{ width: 56, height: 56, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.6)', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.2)' }}>
                  <img src={userData.imageUrl && userData.imageUrl.startsWith('http') ? userData.imageUrl : '/default-avatar.jpg'} alt={userData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', opacity: 0.8 }}>Welcome back</p>
                  <p style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 600 }}>{userData.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.75 }}>ID: {userData.userId}</p>
                </div>
                <span className="l2badge" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>Prabhu Shivacharya</span>
              </div>
              <div style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{grandTotalAll}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>Total Members</span>
              </div>
            </div>

            {/* Count Chips */}
            <p className="l2lbl l2a1">Member counts</p>
            <div className="l2a1" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[{ val: l2TotalAll, lbl: 'Prabhu Shivacharya', color: '#ea580c' }, { val: l3TotalAll, lbl: 'Guru Jangam', color: '#16a34a' }, { val: l4TotalAll, lbl: 'Sri Veerashiva', color: '#2563eb' }].map((s, i) => (
                <div key={i} className="l2chip"><span style={{ fontSize: '22px', fontWeight: 600, color: s.color }}>{s.val}</span><span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: 1.3 }}>{s.lbl}</span></div>
              ))}
            </div>

            {/* Peetha Selector */}
            <p className="l2lbl l2a2">Select peetha</p>
            <div className="l2scroll l2a2" style={{ marginBottom: '14px' }}>
              {memberData.map((member, index) => {
                const color = peethaColors[index % peethaColors.length];
                const pNorm = normStr(member.l1User.peeta || '');
                const imgMatch = peetaImageBySubstring.find(({ key }) => pNorm.includes(key));
                const imgUrl = imgMatch ? imgMatch.img : '/img2.jpg';
                const isActive = selIdx === index;
                return (
                  <button key={index} onClick={() => setSelIdx(index)} className={`l2pbtn${isActive ? ' active' : ''}`}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.bg, overflow: 'hidden', border: isActive ? '2px solid #ea580c' : '2px solid transparent' }}>
                      <img src={imgUrl} alt={member.l1User.peeta} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={(e) => { e.currentTarget.src = '/img2.jpg'; }} />
                    </div>
                    <span style={{ fontSize: '9px', color: isActive ? '#ea580c' : '#64748b', textAlign: 'center', lineHeight: 1.2, fontWeight: isActive ? 600 : 400 }}>{member.l1User.peeta}</span>
                  </button>
                );
              })}
            </div>

            {/* Peetha Detail */}
            {selMember && (
              <div className="l2card l2a3" style={{ padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: peethaColors[selIdx % peethaColors.length].bg, overflow: 'hidden' }}>
                    <img src={(() => { const m = peetaImageBySubstring.find(({ key }) => normStr(selMember.l1User.peeta).includes(key)); return m ? m.img : '/img2.jpg'; })()} alt={selMember.l1User.peeta} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={(e) => { e.currentTarget.src = '/img2.jpg'; }} />
                  </div>
                  <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{selMember.l1User.peeta}</p><p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Sri 1008 Jagadguru</p></div>
                  <span style={{ background: peethaColors[selIdx % peethaColors.length].bg, color: peethaColors[selIdx % peethaColors.length].text, borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>Total: {selTotal}</span>
                </div>
                <table className="l2tbl">
                  <thead><tr><th>Level</th><th style={{ textAlign: 'right' }}>Count</th></tr></thead>
                  <tbody>
                    {[{ lbl: 'Sri 108 Shivacharyaru', val: selMember.l2UserCount ?? 0 }, { lbl: 'Jangamaru', val: selMember.l3UserCount ?? 0 }, { lbl: 'Sri Veerashava Lingayatharu', val: selMember.l4UserCount ?? 0 }, { lbl: 'Total', val: selTotal }].map((row, i) => (
                      <tr key={i}><td>{row.lbl}</td><td style={{ textAlign: 'right' }}>{row.val}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Membership Card */}
            <p className="l2lbl l2a4">Your membership card</p>

            {/* Front / Back toggle */}
            <div className="l2a4" style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {(['front', 'back'] as const).map((side) => (
                <button key={side} onClick={() => setL2CardSide(side)} style={{
                  flex: 1, padding: '9px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: l2CardSide === side ? 'none' : '1.5px solid #e2e8f0',
                  background: l2CardSide === side ? 'linear-gradient(135deg,#ea580c,#c2410c)' : '#fff',
                  color: l2CardSide === side ? '#fff' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: l2CardSide === side ? '0 4px 12px rgba(234,88,12,0.3)' : 'none',
                }}>
                  {side === 'front' ? '🪪 Front' : '🔁 Back'}
                </button>
              ))}
            </div>

            <div id="card-print-area">
              {/* Front Card — PAN card size 324×204px */}
              {l2CardSide === 'front' && (
                <div className="l2a4" style={{
                  width: '100%', maxWidth: '324px', height: '204px', margin: '0 auto 14px',
                  borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 28px rgba(234,88,12,0.2), 0 2px 8px rgba(0,0,0,0.08)',
                  border: '1.5px solid rgba(234,88,12,0.15)', background: '#fff', position: 'relative',
                }}>
                  {/* Card header */}
                  <div style={{
                    background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 60%,#9a3412 100%)',
                    padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px',
                    position: 'relative', overflow: 'hidden', flexShrink: 0,
                  }}>
                    <div style={{ position: 'absolute', top: -15, right: -10, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <img src="/logomain1.png" alt="Logo"
                      style={{ width: 30, height: 30, objectFit: 'contain', borderRadius: '6px', background: '#fff', padding: '2px', flexShrink: 0, zIndex: 1 }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div style={{ zIndex: 1 }}>
                      <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Sanathana Veera Shiva Lingayatha Dharma</p>
                      <p style={{ margin: 0, fontSize: '8px', color: 'rgba(255,255,255,0.85)' }}>Member Card</p>
                    </div>
                  </div>
                  {/* Watermark */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
                    <img src="/logomain1.png" alt="" style={{ opacity: 0.04, width: '45%' }} />
                  </div>
                  {/* Body */}
                  <div style={{ padding: '8px 10px', display: 'flex', gap: '10px', alignItems: 'flex-start', position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
                    <div style={{ flex: 1 }}>
                      {[{ lbl: 'Full Name', val: userData.name }, { lbl: 'Member ID', val: userData.userId }, { lbl: 'Peetha', val: userData.peeta || 'N/A' }, { lbl: 'DOB', val: userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A' }, { lbl: 'Phone', val: userData.contactNo }].map((row, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                          <span style={{ fontSize: '6.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>{row.lbl}</span>
                          <p style={{ margin: '1px 0 0', fontSize: '10px', color: '#0f172a', fontWeight: 600, lineHeight: 1.2 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <div style={{ borderRadius: '6px', overflow: 'hidden', border: '2px solid #ea580c', boxShadow: '0 2px 8px rgba(234,88,12,0.3)' }}>
                        <img src={userData.imageUrl && userData.imageUrl.startsWith('http') ? userData.imageUrl : '/default-avatar.jpg'} alt={userData.name} style={{ width: 50, height: 62, objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }} />
                      </div>
                      <span style={{ fontSize: '6px', color: '#ef4444', fontWeight: 700, background: '#fef2f2', padding: '1px 4px', borderRadius: '20px', border: '1px solid #fca5a5', whiteSpace: 'nowrap' }}>E-KYC PENDING</span>
                    </div>
                  </div>
                  {/* Footer strip */}
                  <div style={{ background: 'linear-gradient(90deg,#fef3c7,#fde68a)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '6.5px', color: '#92400e', fontWeight: 700 }}>SRI PRABHU SHIVACHARYA LINGAYATHA</span>
                    <span style={{ fontSize: '6.5px', color: '#92400e' }}>Valid ✓</span>
                  </div>
                </div>
              )}

              {/* Back Card — PAN card size 324×204px */}
              {l2CardSide === 'back' && (
                <div className="l2a4" style={{
                  width: '100%', maxWidth: '324px', height: '204px', margin: '0 auto 14px',
                  borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)',
                  border: '1.5px solid #e2e8f0', background: '#fff', position: 'relative',
                }}>
                  {/* Back header */}
                  <div style={{
                    background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)',
                    padding: '6px 10px', flexShrink: 0,
                  }}>
                    <p style={{ margin: 0, fontSize: '8px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dheksha Guru</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>{userData.dhekshaGuru || 'N/A'}</p>
                  </div>
                  {/* Body — details + QR */}
                  <div style={{ padding: '8px 10px', display: 'flex', gap: '10px', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                    <div style={{ flex: 1 }}>
                      {[{ lbl: 'DOB', val: userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A' }, { lbl: 'Address', val: userData.address || 'N/A' }].map((row, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '6.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>{row.lbl}</span>
                          <p style={{ margin: '1px 0 0', fontSize: '10px', color: '#0f172a', fontWeight: 500, lineHeight: 1.25 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '8px', border: '2px solid #ea580c', boxShadow: '0 2px 8px rgba(234,88,12,0.2)' }}>
                        <QRCodeSVG
                          value={JSON.stringify({ name: userData.name, id: userData.userId, peeta: userData.peeta, dob: userData.dob, phone: userData.contactNo, guru: userData.dhekshaGuru })}
                          size={72} level="H" includeMargin={false}
                        />
                      </div>
                      <span style={{ fontSize: '6.5px', color: '#64748b', fontWeight: 600 }}>Scan to verify</span>
                    </div>
                  </div>
                  {/* Footer strip */}
                  <div style={{ background: 'linear-gradient(90deg,#fef3c7,#fde68a)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '6px', color: '#92400e', fontWeight: 700 }}>{userData.contactNo}</span>
                    <span style={{ fontSize: '8px', color: '#92400e' }}>📱</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="l2a4" style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button onClick={downloadUserCard} disabled={isDownloading} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: isDownloading ? '#9ca3af' : '#ea580c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: isDownloading ? 'not-allowed' : 'pointer' }}>{isDownloading ? 'Generating...' : '⬇ Download card'}</button>
              <button onClick={goToCompleteProfile} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#1e293b', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>✎ Edit profile</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Navbar />

      <div className="bg-slate-100 py-6">
        {profileIncomplete && showProfilePrompt && (
          <div className="mx-auto max-w-[90%] sm:max-w-[95%] mt-20 mb-2 p-3 rounded bg-yellow-100 text-yellow-900 flex items-center justify-between shadow">
            <span>Your profile is incomplete. Please fill the remaining details.</span>
            <div className="flex gap-2">
              <button onClick={() => router.push('/l2/complete-profile')} className="bg-orange-500 text-white px-3 py-1 rounded">Complete Now</button>
              <button onClick={() => setShowProfilePrompt(false)} className="bg-gray-200 text-gray-800 px-3 py-1 rounded">Dismiss</button>
            </div>
          </div>
        )}
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-24">
          Dashboard
        </h1>

        {/* Actions */}
        <div className="flex justify-end gap-3 mb-4 mr-6">
          {profileIncomplete && (
            <button
              onClick={goToCompleteProfile}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Complete Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
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
                    Sri 1008 Jagdguru Peeta Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ 1008 Ã Â¤Å“Ã Â¤â€”Ã Â¤Â¦Ã Â¥ÂÃ Â¤â€”Ã Â¥ÂÃ Â¤Â°Ã Â¥Â Ã Â¤ÂªÃ Â¥â‚¬Ã Â¤Â  Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â³Â§Ã Â³Â¦Ã Â³Â¦Ã Â³Â® Ã Â²Å“Ã Â²â€”Ã Â²Â¦Ã Â³ÂÃ Â²â€”Ã Â³ÂÃ Â²Â°Ã Â³Â Ã Â²ÂªÃ Â³â‚¬Ã Â²Â 
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
                  {/* Totals Column Header */}
                  <th className="border border-gray-800 p-1 sm:p-2 bg-yellow-600 text-white text-center min-w-[80px]">Total</th>
                </tr>
              </thead>

              <tbody>
                {/* L2 Row - User Counts */}
                <tr className="border border-gray-800 hover:bg-yellow-100">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">
                    Sri 108 Prabhu shivachrya
                    <br />
                    Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ 108 Ã Â¤ÂªÃ Â¥ÂÃ Â¤Â°Ã Â¤Â­Ã Â¥Â Ã Â¤Â¶Ã Â¤Â¿Ã Â¤ÂµÃ Â¤Â¾Ã Â¤Å¡Ã Â¤Â¾Ã Â¤Â°Ã Â¥ÂÃ Â¤Â¯
                    <br />
                    Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ 108 Ã Â²ÂªÃ Â³ÂÃ Â²Â°Ã Â²Â­Ã Â³Â Ã Â²Â¶Ã Â²Â¿Ã Â²ÂµÃ Â²Â¾Ã Â²Å¡Ã Â²Â¾Ã Â²Â°Ã Â³ÂÃ Â²Â¯Ã Â²Â°Ã Â³Â
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {member.l2UserCount ?? 0}
                    </td>
                  ))}
                  {/* Row total for L2 */}
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l2TotalAll}</td>
                </tr>

                {/* L3 Row - User Counts */}
                <tr className="border border-gray-800 hover:bg-yellow-100">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">
                    Sri guru Jangam
                    <br />
                    Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤â€”Ã Â¥ÂÃ Â¤Â°Ã Â¥Â Ã Â¤Å“Ã Â¤â€šÃ Â¤â€”Ã Â¤Â®
                    <br />
                    Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²â€”Ã Â³ÂÃ Â²Â°Ã Â³Â Ã Â²Å“Ã Â²â€šÃ Â²â€”Ã Â²Â®
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {member.l3UserCount ?? 0}
                    </td>
                  ))}
                  {/* Row total for L3 */}
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l3TotalAll}</td>
                </tr>

                {/* L4 Row - User Counts */}
                <tr className="border border-gray-800 hover:bg-yellow-100">
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">
                    Sri Veerashiva
                    <br />
                    Ã Â¤Â¶Ã Â¥ÂÃ Â¤Â°Ã Â¥â‚¬ Ã Â¤ÂµÃ Â¥â‚¬Ã Â¤Â°Ã Â¤Â¶Ã Â¤Â¿Ã Â¤Âµ
                    <br />
                    Ã Â²Â¶Ã Â³ÂÃ Â²Â°Ã Â³â‚¬ Ã Â²ÂµÃ Â³â‚¬Ã Â²Â°Ã Â²Â¶Ã Â³Ë†Ã Â²Âµ
                  </td>
                  {memberData.map((member, index) => (
                    <td
                      key={index}
                      className="border border-gray-800 p-1 sm:p-2 text-center"
                    >
                      {member.l4UserCount ?? 0}
                    </td>
                  ))}
                  {/* Row total for L4 */}
                  <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l4TotalAll}</td>
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
                  {/* Grand total column */}
                  <td className="border border-gray-800 p-1 sm:p-2 text-center">{grandTotalAll}</td>
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
          {/* ── Membership Card (Desktop) ── */}
          <div className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-8">
            <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">Your Membership Card</h2>

            {/* Front / Back toggle */}
            <div style={{ display: 'flex', gap: '6px', maxWidth: '324px', margin: '0 auto 16px' }}>
              {(['front', 'back'] as const).map((side) => (
                <button key={side} onClick={() => setL2CardSide(side)} style={{
                  flex: 1, padding: '9px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: l2CardSide === side ? 'none' : '1.5px solid #e2e8f0',
                  background: l2CardSide === side ? 'linear-gradient(135deg,#ea580c,#c2410c)' : '#fff',
                  color: l2CardSide === side ? '#fff' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: l2CardSide === side ? '0 4px 12px rgba(234,88,12,0.3)' : 'none',
                }}>
                  {side === 'front' ? '🪪 Front' : '🔁 Back'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {l2CardSide === 'front' && (
                <div style={{
                  width: '324px', height: '204px',
                  borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 28px rgba(234,88,12,0.2), 0 2px 8px rgba(0,0,0,0.08)',
                  border: '1.5px solid rgba(234,88,12,0.15)', background: '#fff', position: 'relative',
                }}>
                  <div style={{ background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 60%,#9a3412 100%)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: -15, right: -10, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <img src="/logomain1.png" alt="Logo" style={{ width: 30, height: 30, objectFit: 'contain', borderRadius: '6px', background: '#fff', padding: '2px', flexShrink: 0, zIndex: 1 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div style={{ zIndex: 1 }}>
                      <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Sanathana Veera Shiva Lingayatha Dharma</p>
                      <p style={{ margin: 0, fontSize: '8px', color: 'rgba(255,255,255,0.85)' }}>Member Card</p>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
                    <img src="/logomain1.png" alt="" style={{ opacity: 0.04, width: '45%' }} />
                  </div>
                  <div style={{ padding: '8px 10px', display: 'flex', gap: '10px', alignItems: 'flex-start', position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
                    <div style={{ flex: 1 }}>
                      {[{ lbl: 'Full Name', val: userData.name }, { lbl: 'Member ID', val: userData.userId }, { lbl: 'Peetha', val: userData.peeta || 'N/A' }, { lbl: 'DOB', val: userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A' }, { lbl: 'Phone', val: userData.contactNo }].map((row, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                          <span style={{ fontSize: '6.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>{row.lbl}</span>
                          <p style={{ margin: '1px 0 0', fontSize: '10px', color: '#0f172a', fontWeight: 600, lineHeight: 1.2 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <div style={{ borderRadius: '6px', overflow: 'hidden', border: '2px solid #ea580c', boxShadow: '0 2px 8px rgba(234,88,12,0.3)' }}>
                        <img src={userData.imageUrl && userData.imageUrl.startsWith('http') ? userData.imageUrl : '/default-avatar.jpg'} alt={userData.name} style={{ width: 50, height: 62, objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }} />
                      </div>
                      <span style={{ fontSize: '6px', color: '#ef4444', fontWeight: 700, background: '#fef2f2', padding: '1px 4px', borderRadius: '20px', border: '1px solid #fca5a5', whiteSpace: 'nowrap' }}>E-KYC PENDING</span>
                    </div>
                  </div>
                  <div style={{ background: 'linear-gradient(90deg,#fef3c7,#fde68a)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '6.5px', color: '#92400e', fontWeight: 700 }}>SRI PRABHU SHIVACHARYA LINGAYATHA</span>
                    <span style={{ fontSize: '6.5px', color: '#92400e' }}>Valid ✓</span>
                  </div>
                </div>
              )}
              {l2CardSide === 'back' && (
                <div style={{
                  width: '324px', height: '204px',
                  borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)',
                  border: '1.5px solid #e2e8f0', background: '#fff', position: 'relative',
                }}>
                  <div style={{ background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)', padding: '6px 10px', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: '8px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dheksha Guru</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>{userData.dhekshaGuru || 'N/A'}</p>
                  </div>
                  <div style={{ padding: '8px 10px', display: 'flex', gap: '10px', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                    <div style={{ flex: 1 }}>
                      {[{ lbl: 'DOB', val: userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A' }, { lbl: 'Address', val: userData.address || 'N/A' }].map((row, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '6.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>{row.lbl}</span>
                          <p style={{ margin: '1px 0 0', fontSize: '10px', color: '#0f172a', fontWeight: 500, lineHeight: 1.25 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '8px', border: '2px solid #ea580c', boxShadow: '0 2px 8px rgba(234,88,12,0.2)' }}>
                        <QRCodeSVG value={JSON.stringify({ name: userData.name, id: userData.userId, peeta: userData.peeta, dob: userData.dob, phone: userData.contactNo, guru: userData.dhekshaGuru })} size={72} level="H" includeMargin={false} />
                      </div>
                      <span style={{ fontSize: '6.5px', color: '#64748b', fontWeight: 600 }}>Scan to verify</span>
                    </div>
                  </div>
                  <div style={{ background: 'linear-gradient(90deg,#fef3c7,#fde68a)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '6px', color: '#92400e', fontWeight: 700 }}>SANATHANA VEERA SHIVA LINGAYATHA DHARMA</span>
                    <span style={{ fontSize: '8px', color: '#92400e' }}>&#128305;</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-6">
              <button onClick={downloadUserCard} disabled={isDownloading} style={{ backgroundColor: isDownloading ? '#9ca3af' : '#ea580c', color: '#ffffff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', cursor: isDownloading ? 'not-allowed' : 'pointer', border: 'none', fontWeight: 'bold', opacity: isDownloading ? 0.7 : 1 }} onMouseOver={(e) => { if (!isDownloading) e.currentTarget.style.backgroundColor = '#c2410c'; }} onMouseOut={(e) => { if (!isDownloading) e.currentTarget.style.backgroundColor = '#ea580c'; }}>
                {isDownloading ? <div className="flex items-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Generating PDF...</div> : 'Download ID Card as PDF'}
              </button>
            </div>
          </div>
       </div>
       <Footer />
     </>
   );
 }

