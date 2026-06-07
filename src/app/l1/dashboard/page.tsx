"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
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
  l2Users: number;
  l3Users: number;
  l4Users: number;
}

interface UserData {
  name: string;
  userId: string;
  dob: string;
  contactNo: string;
  peeta: string | null;
  dhekshaGuru: string | null;
  imageUrl: string;
  address?: string;
}

export default function Dashboard() {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selIdx, setSelIdx] = useState(0);
  const [l1CardSide, setL1CardSide] = useState<'front' | 'back'>('front');

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
        const memberResponse = await fetch(
          `/api/l1/dashboard?timestamp=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        if (!memberResponse.ok) throw new Error("Failed to fetch member data");
        const memberData: MemberData[] = await memberResponse.json();
        setMemberData(memberData);
        // Calculate total user count
        const totalUsers = memberData.reduce((acc, member) => {
          return (
            acc + member.l2UserCount + member.l3UserCount + member.l4UserCount
          );
        }, 0);
        setTotal(totalUsers);

        // Fetch user data with no caching
        const userResponse = await fetch(
          `/api/l1/userdata/${storedUserId}?timestamp=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
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

  useEffect(() => {
    // Responsive check for mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  useEffect(() => {
    if (userData?.imageUrl) {
      const validateImage = async () => {
        try {
          const response = await fetch(userData.imageUrl);
          if (!response.ok) {
            console.error("Cloudinary image validation failed:", userData.imageUrl);
          }
        } catch (error) {
          console.error("Error validating image:", error);
        }
      };
      validateImage();
    }
  }, [userData]);

  if (!userData) return <p>Loading...</p>;

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
    "Sri Rambhpuri Peeta à¤¶à¥ à¤°à¥€ à¤°à¤®à¥ à¤­à¤¾à¤ªà¥ à¤°à¥€ à¤ªà¥€à¤  à²¶à³ à²°à³€ à²°à²‚à²­à²¾à²ªà³ à²°à²¿ à²ªà³€à² ": "/img1.jpg",
    "Sri Ujjayani Peeta à¤¶à¥ à¤°à¥€ à¤‰à¤œà¥ à¤œà¤¯à¤¨à¥€ à¤ªà¥€à¤  à²¶à³ à²°à³€ à²‰à¤œà¥ à¤œà¤¯à¤¨à²¿ à²ªà³€à² ": "/img2.jpg",
    "Sri Kedhara peeta à¤¶à¥ à¤°à¥€ à¤•à¥‡à¤¦à¤¾à¤°à¤¾ à¤ªà¥€à¤  à²¶à³ à²°à³€ à¤•à¥‡à¤¦à¤¾à¤° à¤ªà¥€à¤ ": "/img3.jpg",
    "Sri SriShaila Peeta à¤¶à¥ à¤°à¥€ à¤¶à¥ à¤°à¥€à¤¶à¥ˆà¤² à¤ªà¥€à¤  à²¶à³ à²°à³€ à²¶à³ à²°à³€à¤¶à³ˆà¤² à²ªà¥€à¤ ": "/img4.jpg",
    "Sri Kashi Peeta à¤¶à¥ à¤°à¥€ à¤•à¤¾à¤¶à¥€ à¤ªà¥€à¤  à²¶à³ à²°à³€ à¤•à¤¾à¤¶à²¿ à¤ªà¥€à² ": "/img5.jpg",
    "Sri viraktha parmpare à¤¶à¥ à¤°à¥€ à¤µà¤¿à¤°à¤•à¥ à¤¤  à¤ªà¤°à¤‚à¤ªà¤°à¤¾ à²¶à³ à²°à³€ à²µà¤¿à¤°à¤•à¥ à¤¤  à¤ªà¤°à¤‚à¤ªà¤°à³†": "/img6.jpg",
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

  // Precompute totals for chips
  const l2TotalAll = memberData.reduce((sum, m) => sum + (m.l2UserCount ?? 0), 0);
  const l3TotalAll = memberData.reduce((sum, m) => sum + (m.l3UserCount ?? 0), 0);
  const l4TotalAll = memberData.reduce((sum, m) => sum + (m.l4UserCount ?? 0), 0);
  const grandTotalAll = l2TotalAll + l3TotalAll + l4TotalAll;

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

  // ── MOBILE LAYOUT ───────────────────────────────────────────────────
  if (isMobile) {
    const selMember = memberData[selIdx] ?? null;
    const selTotal = selMember
      ? (selMember.l2UserCount ?? 0) + (selMember.l3UserCount ?? 0) + (selMember.l4UserCount ?? 0)
      : 0;
    return (
      <>
        <Navbar />
        <style jsx global>{`
          @keyframes l1fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes l1heroPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.04); } }
          @keyframes l1badgePop { 0%{ transform:scale(0.6); opacity:0; } 70%{ transform:scale(1.12); } 100%{ transform:scale(1); opacity:1; } }
          .l1a0 { animation:l1fadeUp 0.4s ease both; }
          .l1a1 { animation:l1fadeUp 0.4s 0.06s ease both; }
          .l1a2 { animation:l1fadeUp 0.4s 0.12s ease both; }
          .l1a3 { animation:l1fadeUp 0.4s 0.18s ease both; }
          .l1a4 { animation:l1fadeUp 0.4s 0.24s ease both; }
          .l1hero { animation:l1heroPulse 3s ease-in-out infinite; }
          .l1badge { animation:l1badgePop 0.5s 0.4s ease both; opacity:0; animation-fill-mode:both; }
          .l1card { background:#fff; border:1px solid #f1f5f9; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
          .l1lbl { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#94a3b8; margin:0 0 10px; }
          .l1chip { flex:1; background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; padding:12px 8px; display:flex; flex-direction:column; align-items:center; gap:3px; }
          .l1scroll { display:flex; gap:8px; overflow-x:auto; padding:4px 0 8px; scrollbar-width:none; }
          .l1scroll::-webkit-scrollbar { display:none; }
          .l1pbtn { display:flex; flex-direction:column; align-items:center; gap:5px; min-width:72px; padding:10px 6px; background:#fff; border:1.5px solid #f1f5f9; border-radius:14px; cursor:pointer; transition:border-color 0.2s,transform 0.15s; }
          .l1pbtn:active { transform:scale(0.95); }
          .l1pbtn.active { border-color:#ea580c; box-shadow:0 2px 8px rgba(234,88,12,0.2); }
          .l1tbl { width:100%; border-collapse:collapse; font-size:13px; }
          .l1tbl th { background:#f8fafc; padding:7px 10px; font-size:11px; font-weight:600; color:#64748b; text-align:left; }
          .l1tbl td { padding:9px 10px; border-bottom:1px solid #f1f5f9; color:#1e293b; }
          .l1tbl tr:last-child td { border-bottom:none; font-weight:600; }
        `}</style>

        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
          <div style={{ padding: '16px 16px 0' }}>
            {/* Hero Card */}
            <div className="l1a0" style={{ background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)', borderRadius: '20px', padding: '18px 16px', color: '#fff', marginBottom: '14px', marginTop: '72px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                <div className="l1hero" style={{ width: 56, height: 56, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.6)', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.2)' }}>
                  <img src={userData.imageUrl && userData.imageUrl.startsWith('http') ? userData.imageUrl : '/default-avatar.jpg'} alt={userData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', opacity: 0.8 }}>Welcome back</p>
                  <p style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 600 }}>{userData.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.75 }}>ID: {userData.userId}</p>
                </div>
                <span className="l1badge" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>Sri 1008 Jagadguru</span>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{grandTotalAll}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>Total Members</span>
              </div>
            </div>

            {/* Count Chips */}
            <p className="l1lbl l1a1">Member counts</p>
            <div className="l1a1" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[{ val: l2TotalAll, lbl: 'Prabhu Shivacharya', color: '#ea580c' }, { val: l3TotalAll, lbl: 'Guru Jangam', color: '#16a34a' }, { val: l4TotalAll, lbl: 'Sri Veerashiva', color: '#2563eb' }].map((s, i) => (
                <div key={i} className="l1chip"><span style={{ fontSize: '22px', fontWeight: 600, color: s.color }}>{s.val}</span><span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: 1.3 }}>{s.lbl}</span></div>
              ))}
            </div>

            {/* Peetha Selector */}
            <p className="l1lbl l1a2">Select peetha</p>
            <div className="l1scroll l1a2" style={{ marginBottom: '14px' }}>
              {memberData.map((member, index) => {
                const color = peethaColors[index % peethaColors.length];
                const pNorm = normStr(member.l1User.peeta || '');
                const imgMatch = peetaImageBySubstring.find(({ key }) => pNorm.includes(key));
                const imgUrl = imgMatch ? imgMatch.img : '/img2.jpg';
                const isActive = selIdx === index;
                return (
                  <button key={index} onClick={() => setSelIdx(index)} className={`l1pbtn${isActive ? ' active' : ''}`}>
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
              <div className="l1card l1a3" style={{ padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: peethaColors[selIdx % peethaColors.length].bg, overflow: 'hidden' }}>
                    <img src={(() => { const m = peetaImageBySubstring.find(({ key }) => normStr(selMember.l1User.peeta).includes(key)); return m ? m.img : '/img2.jpg'; })()} alt={selMember.l1User.peeta} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={(e) => { e.currentTarget.src = '/img2.jpg'; }} />
                  </div>
                  <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{selMember.l1User.peeta}</p><p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Sri 1008 Jagadguru</p></div>
                  <span style={{ background: peethaColors[selIdx % peethaColors.length].bg, color: peethaColors[selIdx % peethaColors.length].text, borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>Total: {selTotal}</span>
                </div>
                <table className="l1tbl">
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
            <p className="l1lbl l1a4">Your membership card</p>
            <div className="l1a4" style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {(['front', 'back'] as const).map((side) => (
                <button key={side} onClick={() => setL1CardSide(side)} style={{
                  flex: 1, padding: '9px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: l1CardSide === side ? 'none' : '1.5px solid #e2e8f0',
                  background: l1CardSide === side ? 'linear-gradient(135deg,#ea580c,#c2410c)' : '#fff',
                  color: l1CardSide === side ? '#fff' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: l1CardSide === side ? '0 4px 12px rgba(234,88,12,0.3)' : 'none',
                }}>
                  {side === 'front' ? '🪪 Front' : '🔁 Back'}
                </button>
              ))}
            </div>

            {/* Front Card */}
            {l1CardSide === 'front' && (
              <div className="l1a4" style={{ width: '100%', maxWidth: '324px', height: '204px', margin: '0 auto 14px', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 28px rgba(234,88,12,0.2), 0 2px 8px rgba(0,0,0,0.08)', border: '1.5px solid rgba(234,88,12,0.15)', background: '#fff', position: 'relative' }}>
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
                  <span style={{ fontSize: '6.5px', color: '#92400e', fontWeight: 700 }}>SRI 1008 JAGADGURU LINGAYATHA</span>
                  <span style={{ fontSize: '6.5px', color: '#92400e' }}>Valid ✓</span>
                </div>
              </div>
            )}

            {/* Back Card */}
            {l1CardSide === 'back' && (
              <div className="l1a4" style={{ width: '100%', maxWidth: '324px', height: '204px', margin: '0 auto 14px', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0', background: '#fff', position: 'relative' }}>
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
                  <span style={{ fontSize: '8px', color: '#92400e' }}>📱</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
                    Sri 1008 Jagdguru Peeta à¤¶à¥ à¤°à¥€ 1008 à¤œà¤—à¤¦à¥ à¤—à¥ à¤°à¥  à¤ªà¥€à¤  à²¶à³ à²°à³€ à³§à³¦à³¦à³® à²œà²—à¤¦à³ à¤—à³ à¤°à³  à²ªà¥€à¤ 
                  </th>

                  {memberData.map((member, index) => {
                    const peetaKey = member.l1User.peeta.trim().toLowerCase();
                    const matchedPeetaKey = Object.keys(peetaImages).find(
                      key => key.trim().toLowerCase() === peetaKey
                    );
                    const imageUrl = matchedPeetaKey ? peetaImages[matchedPeetaKey] : "/img2.jpg";

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
                    à¤¶à¥ à¤°à¥€ 108 à¤ªà¥ à¤°à¤­à¥  à¤¶à¤¿à¤µà¤¾à¤šà¤¾à¤°à¥ à¤¯
                    <br />
                    à²¶à³ à²°à³€ 108 à²ªà³ à²°à²­à³  à²¶à²¿à²µà²¾à²šà¤¾à²°à³ à¤¯à²°à³ 
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
                    à¤¶à¥ à¤°à¥€ à¤—à¥ à¤°à¥  à¤œà¤‚à¤—à¤®
                    <br />
                    à²¶à³ à²°à³€ à²—à³ à²°à³  à²œà¤‚à¤—à¤®
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
                    à¤¶à¥ à¤°à¥€ à¤µà¥€à¤°à¤¶à¤¿à¤µ
                    <br />
                    à²¶à³ à²°à³€ à²µà³€à²°à¤¶à³ˆà²µ
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
              â†’
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
                        <p className="text-sm font-semibold" style={{ color: '#000', backgroundColor: '#fff' }}>Phone: {userData.contactNo}</p>
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
        </div>
      </div>
      <Footer />
    </>
  );
}

