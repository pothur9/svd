"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { QRCodeSVG } from "qrcode.react";
import AuthManager from "../../../lib/auth";
import CenteredLoader from "../../../components/CenteredLoader";
import Toast from "../../../components/Toast";


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
  const [isMobile, setIsMobile] = useState(false);
  type DistrictsMap = Record<string, string[]>;
  const [districtsMap, setDistrictsMap] = useState<DistrictsMap>({});
  const [addressSel, setAddressSel] = useState<Record<string, { state: string; district: string; city: string }>>({});
  const [sonOfTitle, setSonOfTitle] = useState<string>("");
  const [sonOfName, setSonOfName] = useState<string>("");
  const [selectedPeethaIndex, setSelectedPeethaIndex] = useState<number>(0);
  const [l3CardSide, setL3CardSide] = useState<'front' | 'back'>('front');
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "bonus" } | null>(null);


  // Cloudinary config (same approach as L2)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Upload image helper (mirrors L2 complete-profile)
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    try {
      if (!cloudName || !uploadPreset) {
        console.log("Image upload not configured. Please paste an image URL instead.");
        return;
      }
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, photoUrl: data.secure_url as string }));
    } catch (e) {
      console.error(e);
      console.log("Failed to upload image. Please try again or paste a URL.");
    }
  };

  const handleDownloadCard = () => {
    document.body.classList.add('print-card-only');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('print-card-only');
    }, 50);
  };

  const router = useRouter();

  // Responsive check for mobile like L2 (must be declared before any early returns)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load states and districts from public/districts.json
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const res = await fetch('/districts.json', { cache: 'force-cache' });
        if (res.ok) {
          const data = await res.json();
          setDistrictsMap(data as DistrictsMap);
        }
      } catch (e) {
        console.error('Failed to load districts.json', e);
      }
    };
    loadDistricts();
  }, []);

  

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

    if (sessionStorage.getItem("showWelcomeBonus") === "true") {
      setToast({
        message: "Welcome! 🎉\n508 Rudhars have been added to your wallet!",
        type: "bonus",
      });
      sessionStorage.removeItem("showWelcomeBonus");
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

  // Compute completeness handled in ALL_L3_FIELDS effect below

  // Determine missing fields against full L3 field set (from translations signupl3)
  useEffect(() => {
    if (!userData) return;
    const ALL_L3_FIELDS: string[] = [
      'dob','gender','mailId','karthruGuru','peeta','bhage','gothra','nationality','presentAddress','permanentAddress','qualification','occupation','languageKnown','photoUrl',
      // newly added optional profile fields
      'kula','married','higherDegree','maneDhevaruName','maneDhevaruAddress','subKula','sonOf'
    ];
    const userRecord = userData as unknown as Record<string, unknown>;
    const missing: string[] = ALL_L3_FIELDS.filter((k) => {
      const v = userRecord[k];
      return v === undefined || v === null || (typeof v === 'string' && (v as string).trim() === '');
    });
    setMissingFields(missing);
    // If nothing missing, mark profile as complete and ensure modal is closed
    if (missing.length === 0) {
      setProfileIncomplete(false);
      setShowCompleteForm(false);
    } else {
      setProfileIncomplete(true);
    }
    const preset: Record<string, string> = {};
    missing.forEach((k) => {
      preset[k] = '';
    });
    setFormData(preset);
  }, [userData]);

  // Immediate prompt; no delay

  if (memberData.length === 0 || !userData) return <CenteredLoader message="Loading..." />;

  // Precompute totals across peetas like L2
  const l2TotalAll = memberData.reduce((sum, m) => sum + (m.l2UserCount ?? 0), 0);
  const l3TotalAll = memberData.reduce((sum, m) => sum + (m.l3UserCount ?? 0), 0);
  const l4TotalAll = memberData.reduce((sum, m) => sum + (m.l4UserCount ?? 0), 0);
  const grandTotalAll = l2TotalAll + l3TotalAll + l4TotalAll;

  // Label helper for dynamic fields
  const displayLabel = (f: string) => (f === 'mailId' ? 'Email ID' : f);


  // Helpers for mobile transposed table
  const getUserCounts = (member: MemberData) => [
    member.l2UserCount ?? 0,
    member.l3UserCount ?? 0,
    member.l4UserCount ?? 0,
    (member.l2UserCount ?? 0) + (member.l3UserCount ?? 0) + (member.l4UserCount ?? 0),
  ];
  const userTypeFullLabels = [
    'Sri 108 Prabhu shivachrya',
    'Sri guru Jangam',
    'Sri Veerashiva',
    'Total',
  ];

  const peethaColors = [
    { bg: '#fef3c7', text: '#92400e' },
    { bg: '#ede9fe', text: '#5b21b6' },
    { bg: '#e0f2fe', text: '#075985' },
    { bg: '#fce7f3', text: '#9d174d' },
    { bg: '#dcfce7', text: '#166534' },
    { bg: '#fee2e2', text: '#991b1b' },
  ];
  const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z]/g, '');
  const peetaImageBySubstring: { key: string; img: string }[] = [
    { key: 'rambh', img: '/img1.jpg' },
    { key: 'ujjay', img: '/img2.jpg' },
    { key: 'kedhar', img: '/img3.jpg' },
    { key: 'srishail', img: '/img4.jpg' },
    { key: 'kashi', img: '/img5.jpg' },
    { key: 'virakth', img: '/img6.jpg' },
  ];
  const selectedMember = memberData[selectedPeethaIndex] ?? null;
  const selTotal = selectedMember
    ? (selectedMember.l2UserCount ?? 0) + (selectedMember.l3UserCount ?? 0) + (selectedMember.l4UserCount ?? 0)
    : 0;

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────────
  if (isMobile) {
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
          @keyframes l3fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes l3heroPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.04); } }
          @keyframes l3badgePop { 0%{ transform:scale(0.6); opacity:0; } 70%{ transform:scale(1.12); } 100%{ transform:scale(1); opacity:1; } }
          .l3a0 { animation:l3fadeUp 0.4s ease both; }
          .l3a1 { animation:l3fadeUp 0.4s 0.06s ease both; }
          .l3a2 { animation:l3fadeUp 0.4s 0.12s ease both; }
          .l3a3 { animation:l3fadeUp 0.4s 0.18s ease both; }
          .l3a4 { animation:l3fadeUp 0.4s 0.24s ease both; }
          .l3hero { animation:l3heroPulse 3s ease-in-out infinite; }
          .l3badge { animation:l3badgePop 0.5s 0.4s ease both; opacity:0; animation-fill-mode:both; }
          .l3card { background:#fff; border:1px solid #f1f5f9; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
          .l3lbl { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#94a3b8; margin:0 0 10px; }
          .l3chip { flex:1; background:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; padding:12px 8px; display:flex; flex-direction:column; align-items:center; gap:3px; }
          .l3scroll { display:flex; gap:8px; overflow-x:auto; padding:4px 0 8px; scrollbar-width:none; }
          .l3scroll::-webkit-scrollbar { display:none; }
          .l3pbtn { display:flex; flex-direction:column; align-items:center; gap:5px; min-width:72px; padding:10px 6px; background:#fff; border:1.5px solid #f1f5f9; border-radius:14px; cursor:pointer; transition:border-color 0.2s,transform 0.15s; }
          .l3pbtn:active { transform:scale(0.95); }
          .l3pbtn.active { border-color:#ea580c; box-shadow:0 2px 8px rgba(234,88,12,0.2); }
          .l3tbl { width:100%; border-collapse:collapse; font-size:13px; }
          .l3tbl th { background:#f8fafc; padding:7px 10px; font-size:11px; font-weight:600; color:#64748b; text-align:left; }
          .l3tbl td { padding:9px 10px; border-bottom:1px solid #f1f5f9; color:#1e293b; }
          .l3tbl tr:last-child td { border-bottom:none; font-weight:600; }
        `}</style>

        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem' }}>
          {profileIncomplete && (
            <div className="l3a0" style={{ margin: '12px 16px 0', background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '3px solid #f59e0b', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span style={{ fontSize: '13px', color: '#78350f', flex: 1 }}>Profile incomplete — {missingFields.length} fields missing</span>
              <button onClick={() => setShowCompleteForm(true)} style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Fill now</button>
            </div>
          )}
          {showCompleteForm && profileIncomplete && missingFields.length > 0 && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ background: '#fff', width: '100%', borderRadius: '20px 20px 0 0', padding: '20px 16px 32px', maxHeight: '85vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Complete Your Profile</h2>
                  <button onClick={() => setShowCompleteForm(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}>✕</button>
                </div>
                {(() => {
                  const perStep = 5;
                  const totalSteps = Math.ceil(missingFields.length / perStep);
                  const fieldsForStep = missingFields.slice(currentStep * perStep, currentStep * perStep + perStep);
                  return (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const stored = typeof window !== 'undefined' ? sessionStorage.getItem('userId') || '' : '';
                        const payload: Record<string, string> = {};
                        missingFields.forEach((k) => { if (formData[k] !== undefined && formData[k] !== '') payload[k] = formData[k]; });
                        const res = await fetch(`/api/l3/update-profile/${stored}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.message || 'Failed');
                        const refreshed = await fetch(`/api/l3/dashboard/${stored}?timestamp=${Date.now()}`, { cache: 'no-store' });
                        if (refreshed.ok) { const ud = await refreshed.json(); setUserData(ud); setProfileIncomplete(false); setMissingFields([]); setFormData({}); setShowCompleteForm(false); setCurrentStep(0); }
                      } catch (err) { console.error(err); }
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {fieldsForStep.map((field) => (
                        <div key={field}>
                          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '5px', textTransform: 'capitalize' }}>{displayLabel(field)}</label>
                          {field === 'dob' ? (
                            <input type="date" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', color: '#1e293b', boxSizing: 'border-box' }} />
                          ) : field === 'gender' ? (
                            <select value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', color: '#1e293b' }}>
                              <option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                            </select>
                          ) : (
                            <input type={field === 'mailId' ? 'email' : 'text'} value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff', color: '#1e293b', boxSizing: 'border-box' }} />
                          )}
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: currentStep === 0 ? '#94a3b8' : '#1e293b', fontSize: '14px', cursor: currentStep === 0 ? 'default' : 'pointer' }}>← Back</button>
                        {currentStep < totalSteps - 1 ? (
                          <button type="button" onClick={() => setCurrentStep((s) => s + 1)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ea580c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Next →</button>
                        ) : (
                          <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Save ✓</button>
                        )}
                      </div>
                      <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>Step {currentStep + 1} of {totalSteps}</p>
                    </form>
                  );
                })()}
              </div>
            </div>
          )}

          <div style={{ padding: '16px 16px 0' }}>
            {/* Hero Card */}
            <div className="l3a0" style={{ background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)', borderRadius: '20px', padding: '18px 16px', color: '#fff', marginBottom: '14px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                <div className="l3hero" style={{ width: 56, height: 56, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.6)', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.2)' }}>
                  <img src={userData.photoUrl && userData.photoUrl.startsWith('http') ? userData.photoUrl : '/default-avatar.jpg'} alt={userData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', opacity: 0.8 }}>Welcome back</p>
                  <p style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 600 }}>{userData.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.75 }}>ID: {userData.userId}</p>
                </div>
                <span className="l3badge" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>Guru Jangam</span>
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
            <p className="l3lbl l3a1">Member counts</p>
            <div className="l3a1" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[{ val: l2TotalAll, lbl: 'Prabhu Shivacharya', color: '#ea580c' }, { val: l3TotalAll, lbl: 'Guru Jangam', color: '#16a34a' }, { val: l4TotalAll, lbl: 'Sri Veerashiva', color: '#2563eb' }].map((s, i) => (
                <div key={i} className="l3chip"><span style={{ fontSize: '22px', fontWeight: 600, color: s.color }}>{s.val}</span><span style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: 1.3 }}>{s.lbl}</span></div>
              ))}
            </div>

            {/* Peetha Selector */}
            <p className="l3lbl l3a2">Select peetha</p>
            <div className="l3scroll l3a2" style={{ marginBottom: '14px' }}>
              {memberData.map((member, index) => {
                const color = peethaColors[index % peethaColors.length];
                const pNorm = norm(member.l1User.peeta || '');
                const imgMatch = peetaImageBySubstring.find(({ key }) => pNorm.includes(key));
                const imgUrl = imgMatch ? imgMatch.img : '/img2.jpg';
                const isActive = selectedPeethaIndex === index;
                return (
                  <button key={index} onClick={() => setSelectedPeethaIndex(index)} className={`l3pbtn${isActive ? ' active' : ''}`}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.bg, overflow: 'hidden', border: isActive ? '2px solid #ea580c' : '2px solid transparent' }}>
                      <img src={imgUrl} alt={member.l1User.peeta} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={(e) => { e.currentTarget.src = '/img2.jpg'; }} />
                    </div>
                    <span style={{ fontSize: '9px', color: isActive ? '#ea580c' : '#64748b', textAlign: 'center', lineHeight: 1.2, fontWeight: isActive ? 600 : 400 }}>{member.l1User.peeta}</span>
                  </button>
                );
              })}
            </div>

            {/* Peetha Detail */}
            {selectedMember && (
              <div className="l3card l3a3" style={{ padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: peethaColors[selectedPeethaIndex % peethaColors.length].bg, overflow: 'hidden' }}>
                    <img src={(() => { const m = peetaImageBySubstring.find(({ key }) => norm(selectedMember.l1User.peeta).includes(key)); return m ? m.img : '/img2.jpg'; })()} alt={selectedMember.l1User.peeta} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} onError={(e) => { e.currentTarget.src = '/img2.jpg'; }} />
                  </div>
                  <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{selectedMember.l1User.peeta}</p><p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Sri 1008 Jagadguru</p></div>
                  <span style={{ background: peethaColors[selectedPeethaIndex % peethaColors.length].bg, color: peethaColors[selectedPeethaIndex % peethaColors.length].text, borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>Total: {selTotal}</span>
                </div>
                <table className="l3tbl">
                  <thead><tr><th>Level</th><th style={{ textAlign: 'right' }}>Count</th></tr></thead>
                  <tbody>
                    {[{ lbl: 'Sri 108 Shivacharyaru', val: selectedMember.l2UserCount ?? 0 }, { lbl: 'Jangamaru', val: selectedMember.l3UserCount ?? 0 }, { lbl: 'Sri Veerashava Lingayatharu', val: selectedMember.l4UserCount ?? 0 }, { lbl: 'Total', val: selTotal }].map((row, i) => (
                      <tr key={i}><td>{row.lbl}</td><td style={{ textAlign: 'right' }}>{row.val}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Membership Card — Front / Back tabs */}
            <p className="l3lbl l3a4">Your membership card</p>

            {/* Front / Back toggle */}
            <div className="l3a4" style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {(['front', 'back'] as const).map((side) => (
                <button key={side} onClick={() => setL3CardSide(side)} style={{
                  flex: 1, padding: '9px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  border: l3CardSide === side ? 'none' : '1.5px solid #e2e8f0',
                  background: l3CardSide === side ? 'linear-gradient(135deg,#ea580c,#c2410c)' : '#fff',
                  color: l3CardSide === side ? '#fff' : '#64748b',
                  transition: 'all 0.2s',
                  boxShadow: l3CardSide === side ? '0 4px 12px rgba(234,88,12,0.3)' : 'none',
                }}>
                  {side === 'front' ? '🪪 Front' : '🔁 Back'}
                </button>
              ))}
            </div>

            <div id="card-print-area">
              {/* Front Card — PAN card size 324×204px */}
              {l3CardSide === 'front' && (
                <div className="l3a4" style={{
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
                        <img src={userData.photoUrl && userData.photoUrl.startsWith('http') ? userData.photoUrl : '/default-avatar.jpg'} alt={userData.name} style={{ width: 50, height: 62, objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }} />
                      </div>
                      <span style={{ fontSize: '6px', color: '#ef4444', fontWeight: 700, background: '#fef2f2', padding: '1px 4px', borderRadius: '20px', border: '1px solid #fca5a5', whiteSpace: 'nowrap' }}>E-KYC PENDING</span>
                    </div>
                  </div>
                  {/* Footer strip */}
                  <div style={{ background: 'linear-gradient(90deg,#fef3c7,#fde68a)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '6.5px', color: '#92400e', fontWeight: 700 }}>SRI GURU JANGAM</span>
                    <span style={{ fontSize: '6.5px', color: '#92400e' }}>Valid ✓</span>
                  </div>
                </div>
              )}

              {/* Back Card — PAN card size 324×204px */}
              {l3CardSide === 'back' && (
                <div className="l3a4" style={{
                  width: '100%', maxWidth: '324px', height: '204px', margin: '0 auto 14px',
                  borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)',
                  border: '1.5px solid #e2e8f0', background: '#fff', position: 'relative',
                }}>
                  {/* Back header */}
                  <div style={{
                    background: 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)',
                    padding: '6px 10px',
                  }}>
                    <p style={{ margin: 0, fontSize: '8px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Guru / Karthru Guru</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>{userData.karthruGuru || 'N/A'}</p>
                  </div>
                  {/* Body — details + QR */}
                  <div style={{ padding: '8px 10px', display: 'flex', gap: '10px', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                    <div style={{ flex: 1 }}>
                      {[{ lbl: 'Kula', val: userData.kula || 'N/A' }, { lbl: 'Address', val: userData.permanentAddress || 'N/A' }].map((row, i) => (
                        <div key={i} style={{ marginBottom: '6px' }}>
                          <span style={{ fontSize: '6.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block' }}>{row.lbl}</span>
                          <p style={{ margin: '1px 0 0', fontSize: '10px', color: '#0f172a', fontWeight: 500, lineHeight: 1.25 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <div style={{ background: '#fff', padding: '4px', borderRadius: '8px', border: '2px solid #ea580c', boxShadow: '0 2px 8px rgba(234,88,12,0.2)' }}>
                        <QRCodeSVG
                          value={JSON.stringify({ name: userData.name, id: userData.userId, phone: userData.contactNo, dob: userData.dob, guru: userData.selectedL2User })}
                          size={72} level="H" includeMargin={false}
                        />
                      </div>
                      <span style={{ fontSize: '6.5px', color: '#64748b', fontWeight: 600 }}>Scan to verify</span>
                    </div>
                  </div>
                  {/* Footer strip */}
                  <div style={{ background: 'linear-gradient(90deg,#fef3c7,#fde68a)', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '6px', color: '#92400e', fontWeight: 700 }}>{userData.contactNo||""}</span>
                    <span style={{ fontSize: '8px', color: '#92400e' }}>🔱</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="l3a4" style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button onClick={handleDownloadCard} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#ea580c', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>⬇ Download card</button>
              <button onClick={() => setShowCompleteForm(true)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#1e293b', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>✏ Edit profile</button>
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
                        console.log('Profile updated');
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
                        console.log('Error saving details');
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {fieldsForStep.map((field) => (
                      <div key={field} className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">{displayLabel(field)}</label>
                        {field === 'dob' ? (
                          <input type="date" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" />
                        ) : field === 'gender' ? (
                          <select value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : field === 'sonOf' ? (
                          <div className="flex gap-2">
                            <select
                              value={sonOfTitle}
                              onChange={(e) => {
                                const title = e.target.value;
                                setSonOfTitle(title);
                                const composed = title && sonOfName ? `${title} ${sonOfName}` : '';
                                setFormData((prev) => ({ ...prev, sonOf: composed }));
                              }}
                              className="p-2 border rounded bg-white text-black"
                            >
                              <option value="">Select</option>
                              <option value="S/O">S/O</option>
                              <option value="D/O">D/O</option>
                              <option value="W/O">W/O</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Name"
                              value={sonOfName}
                              onChange={(e) => {
                                const name = e.target.value;
                                setSonOfName(name);
                                const composed = sonOfTitle && name ? `${sonOfTitle} ${name}` : '';
                                setFormData((prev) => ({ ...prev, sonOf: composed }));
                              }}
                              className="flex-1 p-2 border rounded bg-white text-black"
                            />
                          </div>
                        ) : field === 'kula' ? (
                          <select
                            value={formData.kula || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setFormData((prev) => ({ ...prev, kula: v, subKula: '' }));
                            }}
                            className="p-2 border rounded bg-white text-black"
                          >
                            <option value="">Select Kula</option>
                            <option value="Veerashiva Lingayatha Jangama / à²µà³€à²°à²¶à³ˆà²µ à²²à²¿à²‚à²—à²¾à²¯à²¤ à²œà²‚à²—à²®">Veerashiva Lingayatha Jangama / à²µà³€à²°à²¶à³ˆà²µ à²²à²¿à²‚à²—à²¾à²¯à²¤ à²œà²‚à²—à²®</option>
                          </select>
                        ) : field === 'subKula' ? (
                          <select
                            value={formData.subKula || ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subKula: e.target.value }))}
                            className="p-2 border rounded bg-white text-black"
                            disabled={!formData.kula}
                          >
                            <option value="">Select Sub-Kula</option>
                            <option value="Mataadeesharu / à²®à² à²¾à²§à³€à²¶à²°à³">Mataadeesharu / à²®à² à²¾à²§à³€à²¶à²°à³</option>
                            <option value="Matapatthi / à²®à²Ÿà²ªà²¤à³à²¤à²¿">Matapatthi / à²®à²Ÿà²ªà²¤à³à²¤à²¿</option>
                            <option value="Ganachari / à²—à²£à²¾à²šà²¾à²°à²¿">Ganachari / à²—à²£à²¾à²šà²¾à²°à²¿</option>
                            <option value="Saraganachaari / à²¸à²°à²—à²£à²¾à²šà²¾à²°à²¿">Saraganachaari / à²¸à²°à²—à²£à²¾à²šà²¾à²°à²¿</option>
                            <option value="Bidi - ganangalu / à²¬à²¿à²¡à²¿ - à²—à²£à²‚à²—à²²à³">Bidi - ganangalu / à²¬à²¿à²¡à²¿ - à²—à²£à²‚à²—à²²à³</option>
                            <option value="Gante ayyanoru / à²—à²‚à²Ÿà³† à²…à²¯à³à²¯à²¨à³‹à²°à³">Gante ayyanoru / à²—à²‚à²Ÿà³† à²…à²¯à³à²¯à²¨à³‹à²°à³</option>
                            <option value="Shuladha ayyanoru / à²¶à³‚à²²à²§ à²…à²¯à³à²¯à²¨à³‹à²°à³">Shuladha ayyanoru / à²¶à³‚à²²à²§ à²…à²¯à³à²¯à²¨à³‹à²°à³</option>
                            <option value="Pathri ayyanoru / à²ªà²¤à³à²°à²¿ à²…à²¯à³à²¯à²¨à³‹à²°à³">Pathri ayyanoru / à²ªà²¤à³à²°à²¿ à²…à²¯à³à²¯à²¨à³‹à²°à³</option>
                            <option value="Kambi ayyanoru / à²•à²‚à²¬à²¿ à²…à²¯à³à²¯à²¨à³‹à²°à³">Kambi ayyanoru / à²•à²‚à²¬à²¿ à²…à²¯à³à²¯à²¨à³‹à²°à³</option>
                            <option value="Ayyar / à²…à²¯à³à²¯à²°à³">Ayyar / à²…à²¯à³à²¯à²°à³</option>
                          </select>
                        ) : field === 'photoUrl' ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="https://..."
                              value={formData[field] || ''}
                              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                              className="p-2 border rounded bg-white text-black"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) void handleImageUpload(f);
                              }}
                              className="p-1"
                            />
                            {(formData[field] || userData?.photoUrl) && (
                              <img
                                src={(formData[field] || userData?.photoUrl) as string}
                                alt="Preview"
                                className="h-16 w-16 object-cover rounded border"
                              />
                            )}
                          </div>
                        ) : field.toLowerCase().includes('address') ? (
                          <div className="space-y-2">
                            <select
                              value={addressSel[field]?.state || ''}
                              onChange={(e) => {
                                const state = e.target.value;
                                const district = '';
                                const city = addressSel[field]?.city || '';
                                const next = { state, district, city };
                                setAddressSel((prev) => ({ ...prev, [field]: next }));
                                const composed = [city, district, state].filter(Boolean).join(', ');
                                setFormData((prev) => ({ ...prev, [field]: composed }));
                              }}
                              className="p-2 border rounded bg-white text-black"
                            >
                              <option value="">Select State</option>
                              {Object.keys(districtsMap).map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                            <select
                              value={addressSel[field]?.district || ''}
                              onChange={(e) => {
                                const district = e.target.value;
                                const state = addressSel[field]?.state || '';
                                const city = addressSel[field]?.city || '';
                                const next = { state, district, city };
                                setAddressSel((prev) => ({ ...prev, [field]: next }));
                                const composed = [city, district, state].filter(Boolean).join(', ');
                                setFormData((prev) => ({ ...prev, [field]: composed }));
                              }}
                              className="p-2 border rounded bg-white text-black"
                              disabled={!addressSel[field]?.state}
                            >
                              <option value="">Select District</option>
                              {(districtsMap[addressSel[field]?.state || ''] || []).map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              placeholder="City / Village"
                              value={addressSel[field]?.city || ''}
                              onChange={(e) => {
                                const city = e.target.value;
                                const state = addressSel[field]?.state || '';
                                const district = addressSel[field]?.district || '';
                                const next = { state, district, city };
                                setAddressSel((prev) => ({ ...prev, [field]: next }));
                                const composed = [city, district, state].filter(Boolean).join(', ');
                                setFormData((prev) => ({ ...prev, [field]: composed }));
                              }}
                              className="p-2 border rounded bg-white text-black"
                            />
                          </div>
                        ) : (
                          <input
                            type={field === 'mailId' ? 'email' : 'text'}
                            placeholder={field === 'mailId' ? 'Email ID' : ''}
                            value={formData[field] || ''}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            className="p-2 border rounded bg-white text-black"
                          />
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
        <div className="flex justify-center">
          <img src="/count.png" alt="Counts" className="mx-auto w-40 sm:w-56" />
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-16">
          Dashboard
        </h1>
        {/* Responsive Table */}
        <div className="overflow-x-auto mx-auto max-w-[90%] sm:max-w-[95%] mt-10">
          {/* Desktop Table */}
          {!isMobile && (
          <table className="w-full border-collapse border border-gray-800 bg-white shadow-lg text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-800 p-1 sm:p-2 bg-orange-600 text-white text-center min-w-[120px] h-[150px]">
                  Sri 1008 Jagdguru Peeta à¤¶à¥à¤°à¥€ 1008 à¤œà¤—à¤¦à¥à¤—à¥à¤°à¥ à¤ªà¥€à¤  à²¶à³à²°à³€ à³§à³¦à³¦à³® à²œà²—à²¦à³à²—à³à²°à³ à²ªà³€à² 
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
            
              <tr className="border border-gray-800 bg-orange-100 hover:bg-orange-200 font-bold">
                <td className="border border-gray-800 p-1 sm:p-2 text-center">Total</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{(member.l2UserCount ?? 0) + (member.l3UserCount ?? 0) + (member.l4UserCount ?? 0)}</td>
                ))}
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
                  const bgColors = [
                    "bg-green-400",
                    "bg-red-400",
                    "bg-blue-400",
                    "bg-gray-300",
                    "bg-yellow-300",
                    "bg-orange-400",
                  ];
                  const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z]/g, '');
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
                  const counts = getUserCounts(member);
                  return (
                    <tr key={index}>
                      <td className={`border border-gray-800 p-1 text-center font-semibold ${bgColors[index % bgColors.length]} w-1/4 align-middle`} style={{fontSize:'0.7rem', minHeight: '48px', paddingTop: '6px'}}>
                        <div className="flex flex-col items-start h-full">
                          <div className="relative w-[32px] h-[32px] mb-1">
                            <img src={imageUrl} alt={member.l1User.peeta} className="object-cover object-top w-[32px] h-[32px] rounded-full" />
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
        {/* Total Section (same style as L2) */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <img src="/logomain1.png" style={{ width: "150px", height: "150px" }} />
          <h1 className="font-bold text-black text-lg sm:text-2xl flex items-center"> 
            <strong className="text-6xl sm:text-8xl font-extrabold" style={{ letterSpacing: "5px" }}>&rarr;</strong>  
            <span className="ml-4 text-3xl mt-3">Total: {grandTotalAll}</span>
          </h1>
        </div>
        <br/>
       
        {/* Download Button */}
        <div className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-4 flex justify-end">
          <button onClick={handleDownloadCard} className="px-4 py-2 bg-orange-600 text-white rounded shadow hover:bg-orange-700 transition-all">
            Download Card
          </button>
        </div>
        {/* Card section */}
        <div id="card-print-area" className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-2">
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
                    Sanathana Veera Shiva Lingayatha Dharma
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
                    <p className="text-sm font-semibold ">ID: {userData.userId}</p>
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
                  <span className="text-xs font-semibold w-full break-words">Guru: {userData.karthruGuru || 'N/A'}</span>
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
      {/* Print-only CSS to render just the card area */}
      <style jsx global>{`
        @media print {
          body.print-card-only * { visibility: hidden !important; }
          body.print-card-only #card-print-area,
          body.print-card-only #card-print-area * { visibility: visible !important; }
          body.print-card-only #card-print-area { position: absolute; left: 0; top: 0; width: 100%; }

          /* Force background colors to print */
          #card-print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Explicitly force the orange header background */
          #card-print-area [style*="ea580c"] {
            background-color: #ea580c !important;
            color: #ffffff !important;
          }
        }
      `}</style>
    </>
  );
}

