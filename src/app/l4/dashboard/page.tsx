"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { QRCodeSVG } from "qrcode.react";
import CenteredLoader from "../../../components/CenteredLoader";

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
  permanentAddress: string;
  peeta: string;
  selectedL2User: string | null;
  photoUrl: string;
  karthruGuru?: string;
  gender?: string;
  mailId?: string;
  bhage?: string;
  gothra?: string;
  nationality?: string;
  presentAddress?: string;
  qualification?: string;
  occupation?: string;
  languageKnown?: string;
  kula?: string;
  married?: string;
  higherDegree?: string;
  maneDhevaruName?: string;
  maneDhevaruAddress?: string;
  subKula?: string;
  sonOf?: string;
}

export default function Dashboard() {
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPeethaIndex, setSelectedPeethaIndex] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  type DistrictsMap = Record<string, string[]>;
  const [districtsMap, setDistrictsMap] = useState<DistrictsMap>({});
  const [addressSel, setAddressSel] = useState<Record<string, { state: string; district: string; city: string }>>({});
  const [sonOfTitle, setSonOfTitle] = useState<string>("");
  const [sonOfName, setSonOfName] = useState<string>("");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    try {
      if (!cloudName || !uploadPreset) return;
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
    }
  };

  const handleDownloadCard = () => {
    document.body.classList.add("print-card-only");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-card-only");
    }, 50);
  };

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const res = await fetch("/districts.json", { cache: "force-cache" });
        if (res.ok) {
          const data = await res.json();
          setDistrictsMap(data as DistrictsMap);
        }
      } catch (e) {
        console.error("Failed to load districts.json", e);
      }
    };
    loadDistricts();
  }, []);

  useEffect(() => {
    let userId =
      typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
    if (typeof window !== "undefined" && !userId) {
      try {
        const localAuth = localStorage.getItem("svd_auth_user");
        if (localAuth) {
          const parsed = JSON.parse(localAuth) as { userId?: string };
          if (parsed?.userId) {
            sessionStorage.setItem("userId", parsed.userId);
            sessionStorage.setItem("svd_auth_user", localAuth);
            userId = parsed.userId;
          }
        }
      } catch {}
    }

    if (!userId) {
      router.push("/l4/login");
      return;
    }

    async function fetchMemberData() {
      try {
        try {
          if (typeof window !== "undefined") {
            const minimal = { userId } as { userId: string };
            localStorage.setItem("svd_auth_user", JSON.stringify(minimal));
            sessionStorage.setItem("svd_auth_user", JSON.stringify(minimal));
          }
        } catch {}

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
        const memberData = await memberResponse.json();
        setMemberData(memberData);

        const response = await fetch(
          `/api/l4/dashboard/${userId}?timestamp=${Date.now()}`,
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
        if (!response.ok) throw new Error("Network response was not ok");
        const userData = await response.json();
        setUserData(userData);

        sessionStorage.setItem("peeta", userData.peeta || "");
        sessionStorage.setItem("username", userData.name);
        sessionStorage.setItem("guru", userData.selectedL2User || "");
        try {
          if (typeof window !== "undefined") {
            const authObj = {
              userId: userData.userId,
              name: userData.name,
              contactNo: userData.contactNo,
              peeta: userData.peeta,
            };
            localStorage.setItem("svd_auth_user", JSON.stringify(authObj));
            sessionStorage.setItem("svd_auth_user", JSON.stringify(authObj));
          }
        } catch {}
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }

    fetchMemberData();
  }, [router]);

  useEffect(() => {
    if (!userData) return;
    const ALL_FIELDS: string[] = [
      "dob","gender","mailId","karthruGuru","peeta","bhage","gothra","nationality",
      "presentAddress","permanentAddress","qualification","occupation","languageKnown","photoUrl",
      "kula","married","higherDegree","maneDhevaruName","maneDhevaruAddress","subKula","sonOf",
    ];
    const record = userData as unknown as Record<string, unknown>;
    const miss: string[] = ALL_FIELDS.filter((k) => {
      const v = record[k];
      return v === undefined || v === null || (typeof v === "string" && (v as string).trim() === "");
    });
    setMissingFields(miss);
    if (miss.length === 0) {
      setProfileIncomplete(false);
      setShowCompleteForm(false);
    } else {
      setProfileIncomplete(true);
    }
    const preset: Record<string, string> = {};
    miss.forEach((k) => { preset[k] = ""; });
    setFormData(preset);
  }, [userData]);

  // auto-select first peetha matching user's peeta
  useEffect(() => {
    if (!userData || memberData.length === 0) return;
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFKD").replace(/[^a-z]/g, "");
    const userPeeta = norm(userData.peeta || "");
    const idx = memberData.findIndex((m) =>
      userPeeta && norm(m.l1User.peeta).includes(userPeeta.slice(0, 5))
    );
    setSelectedPeethaIndex(idx >= 0 ? idx : 0);
  }, [userData, memberData]);

  if (memberData.length === 0 || !userData) return <CenteredLoader message="Loading..." />;

  const l2TotalAll = memberData.reduce((sum, m) => sum + (m.l2UserCount ?? 0), 0);
  const l3TotalAll = memberData.reduce((sum, m) => sum + (m.l3UserCount ?? 0), 0);
  const l4TotalAll = memberData.reduce((sum, m) => sum + (m.l4UserCount ?? 0), 0);
  const grandTotalAll = l2TotalAll + l3TotalAll + l4TotalAll;

  const displayLabel = (f: string) => (f === "mailId" ? "Email ID" : f);

  const peethaColors = [
    { bg: "#fef3c7", text: "#92400e", icon: "🏛" },
    { bg: "#ede9fe", text: "#5b21b6", icon: "🕌" },
    { bg: "#e0f2fe", text: "#075985", icon: "⛩" },
    { bg: "#fce7f3", text: "#9d174d", icon: "🛕" },
    { bg: "#dcfce7", text: "#166534", icon: "🪔" },
    { bg: "#fee2e2", text: "#991b1b", icon: "🔱" },
  ];

  const norm = (s: string) =>
    s.toLowerCase().normalize("NFKD").replace(/[^a-z]/g, "");
  const peetaNorm = norm(userData.peeta || "");
  const peetaImageBySubstring: { key: string; img: string }[] = [
    { key: "rambh", img: "/img1.jpg" },
    { key: "ujjay", img: "/img2.jpg" },
    { key: "kedhar", img: "/img3.jpg" },
    { key: "srishail", img: "/img4.jpg" },
    { key: "kashi", img: "/img5.jpg" },
    { key: "virakth", img: "/img6.jpg" },
  ];
  const matchedImg = peetaImageBySubstring.find(({ key }) => peetaNorm.includes(key));
  const userPeetaImg = matchedImg ? matchedImg.img : "/img2.jpg";

  const selectedMember =
    selectedPeethaIndex !== null ? memberData[selectedPeethaIndex] : null;
  const selTotal = selectedMember
    ? (selectedMember.l2UserCount ?? 0) +
      (selectedMember.l3UserCount ?? 0) +
      (selectedMember.l4UserCount ?? 0)
    : 0;

  // ── MOBILE LAYOUT ────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <Navbar />

        <style jsx global>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes heroPulse {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.04); }
          }
          @keyframes badgePop {
            0%   { transform: scale(0.6); opacity: 0; }
            70%  { transform: scale(1.12); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes chipIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .anim-0 { animation: fadeUp 0.4s ease both; }
          .anim-1 { animation: fadeUp 0.4s 0.06s ease both; }
          .anim-2 { animation: fadeUp 0.4s 0.12s ease both; }
          .anim-3 { animation: fadeUp 0.4s 0.18s ease both; }
          .anim-4 { animation: fadeUp 0.4s 0.24s ease both; }
          .anim-5 { animation: fadeUp 0.4s 0.30s ease both; }
          .hero-pulse { animation: heroPulse 3s ease-in-out infinite; }
          .badge-pop  { animation: badgePop 0.5s 0.4s ease both; opacity: 0; animation-fill-mode: both; }
          .chip-item  { animation: chipIn 0.35s ease both; }
          .mobile-card {
            background: #fff;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          }
          .section-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #94a3b8;
            margin: 0 0 10px;
          }
          .stat-chip {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 12px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
          }
          .peeta-scroll {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 4px 0 8px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .peeta-scroll::-webkit-scrollbar { display: none; }
          .peeta-chip-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            min-width: 72px;
            padding: 10px 6px;
            background: #fff;
            border: 1.5px solid #f1f5f9;
            border-radius: 14px;
            cursor: pointer;
            transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          }
          .peeta-chip-btn:active { transform: scale(0.95); }
          .peeta-chip-btn.active {
            border-color: #ea580c;
            box-shadow: 0 2px 8px rgba(234,88,12,0.2);
          }
          .detail-table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .detail-table th {
            background: #f8fafc; padding: 7px 10px;
            font-size: 11px; font-weight: 600; color: #64748b;
            text-align: left;
          }
          .detail-table td {
            padding: 9px 10px;
            border-bottom: 1px solid #f1f5f9;
            color: #1e293b;
          }
          .detail-table tr:last-child td { border-bottom: none; font-weight: 600; }

          @media print {
            body.print-card-only * { visibility: hidden !important; }
            body.print-card-only #card-print-area,
            body.print-card-only #card-print-area * { visibility: visible !important; }
            body.print-card-only #card-print-area { position: absolute; left: 0; top: 0; width: 100%; }
            #card-print-area * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            #card-print-area [style*="ea580c"] {
              background-color: #ea580c !important;
              color: #ffffff !important;
            }
          }
        `}</style>

        <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "2rem" }}>

          {/* ── Incomplete banner ── */}
          {profileIncomplete && (
            <div className="anim-0" style={{
              margin: "12px 16px 0",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderLeft: "3px solid #f59e0b",
              borderRadius: "12px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ fontSize: "18px" }}>⚠️</span>
              <span style={{ fontSize: "13px", color: "#78350f", flex: 1 }}>
                Profile incomplete — {missingFields.length} fields missing
              </span>
              <button
                onClick={() => setShowCompleteForm(true)}
                style={{
                  background: "#f59e0b", color: "#fff", border: "none",
                  borderRadius: "8px", padding: "6px 12px", fontSize: "12px",
                  fontWeight: 600, cursor: "pointer",
                }}
              >
                Fill now
              </button>
            </div>
          )}

          {/* ── Complete Profile Modal ── */}
          {showCompleteForm && profileIncomplete && missingFields.length > 0 && (
            <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
              zIndex: 100, display: "flex", alignItems: "flex-end",
            }}>
              <div style={{
                background: "#fff", width: "100%", borderRadius: "20px 20px 0 0",
                padding: "20px 16px 32px", maxHeight: "85vh", overflowY: "auto",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Complete Your Profile</h2>
                  <button onClick={() => setShowCompleteForm(false)}
                    style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "14px" }}>
                    ✕
                  </button>
                </div>
                {(() => {
                  const perStep = 5;
                  const totalSteps = Math.ceil(missingFields.length / perStep);
                  const start = currentStep * perStep;
                  const fieldsForStep = missingFields.slice(start, start + perStep);
                  return (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const stored = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "" : "";
                          const payload: Record<string, string> = {};
                          missingFields.forEach((k) => { if (formData[k] !== undefined && formData[k] !== "") payload[k] = formData[k]; });
                          const res = await fetch(`/api/l4/update-profile/${stored}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data?.message || "Failed to update");
                          const refreshed = await fetch(`/api/l4/dashboard/${stored}?timestamp=${Date.now()}`, { cache: "no-store" });
                          if (refreshed.ok) {
                            const ud = await refreshed.json();
                            setUserData(ud);
                            setProfileIncomplete(false);
                            setMissingFields([]);
                            setFormData({});
                            setShowCompleteForm(false);
                            setCurrentStep(0);
                          }
                        } catch (err) { console.error(err); }
                      }}
                      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
                    >
                      {fieldsForStep.map((field) => (
                        <div key={field}>
                          <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "5px", textTransform: "capitalize" }}>
                            {displayLabel(field)}
                          </label>
                          {field === "dob" ? (
                            <input type="date" value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b", boxSizing: "border-box" }} />
                          ) : field === "gender" ? (
                            <select value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b" }}>
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : field === "sonOf" ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <select value={sonOfTitle}
                                onChange={(e) => { const t = e.target.value; setSonOfTitle(t); setFormData((p) => ({ ...p, sonOf: t && sonOfName ? `${t} ${sonOfName}` : "" })); }}
                                style={{ padding: "10px 8px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", background: "#fff", color: "#1e293b" }}>
                                <option value="">Title</option>
                                <option value="S/O">S/O</option>
                                <option value="D/O">D/O</option>
                                <option value="W/O">W/O</option>
                              </select>
                              <input type="text" placeholder="Name" value={sonOfName}
                                onChange={(e) => { const n = e.target.value; setSonOfName(n); setFormData((p) => ({ ...p, sonOf: sonOfTitle && n ? `${sonOfTitle} ${n}` : "" })); }}
                                style={{ flex: 1, padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b" }} />
                            </div>
                          ) : field === "kula" ? (
                            <select value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value, subKula: "" })}
                              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b" }}>
                              <option value="">Select Kula</option>
                              <option value="Veerashaiva Lingayatha">Veerashaiva Lingayatha</option>
                            </select>
                          ) : field === "subKula" ? (
                            <select value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                              disabled={!formData["kula"]}
                              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b" }}>
                              <option value="">Select Sub Kula</option>
                              <option value="Panchamasaligaru">Panchamasaligaru</option>
                              <option value="Banajigaru">Banajigaru</option>
                              <option value="Kadi - vakkaligaru">Kadi - vakkaligaru</option>
                              <option value="Kumbararu">Kumbararu</option>
                              <option value="Madivalaru">Madivalaru</option>
                              <option value="Lalagondaru">Lalagondaru</option>
                              <option value="Pakanaka reddy">Pakanaka reddy</option>
                              <option value="Reddy">Reddy</option>
                              <option value="Gaanigaru">Gaanigaru</option>
                              <option value="Sadharu">Sadharu</option>
                              <option value="Nonabaru">Nonabaru</option>
                              <option value="Shetty ligayatha">Shetty ligayatha</option>
                              <option value="Gouda lingyatha">Gouda lingyatha</option>
                            </select>
                          ) : field === "photoUrl" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <input type="text" placeholder="https://..." value={formData[field] || ""}
                                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b", boxSizing: "border-box" }} />
                              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImageUpload(f); }} />
                              {(formData[field] || userData?.photoUrl) && (
                                <img src={(formData[field] || userData?.photoUrl) as string} alt="Preview"
                                  style={{ height: "64px", width: "64px", objectFit: "cover", borderRadius: "8px", border: "2px solid #ea580c" }} />
                              )}
                            </div>
                          ) : field.toLowerCase().includes("address") ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <select value={addressSel[field]?.state || ""}
                                onChange={(e) => {
                                  const state = e.target.value;
                                  const next = { state, district: "", city: addressSel[field]?.city || "" };
                                  setAddressSel((p) => ({ ...p, [field]: next }));
                                  setFormData((p) => ({ ...p, [field]: [next.city, "", state].filter(Boolean).join(", ") }));
                                }}
                                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b" }}>
                                <option value="">Select State</option>
                                {Object.keys(districtsMap).map((st) => (<option key={st} value={st}>{st}</option>))}
                              </select>
                              <select value={addressSel[field]?.district || ""}
                                onChange={(e) => {
                                  const district = e.target.value;
                                  const state = addressSel[field]?.state || "";
                                  const city = addressSel[field]?.city || "";
                                  const next = { state, district, city };
                                  setAddressSel((p) => ({ ...p, [field]: next }));
                                  setFormData((p) => ({ ...p, [field]: [city, district, state].filter(Boolean).join(", ") }));
                                }}
                                disabled={!addressSel[field]?.state}
                                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b" }}>
                                <option value="">Select District</option>
                                {(districtsMap[addressSel[field]?.state || ""] || []).map((d) => (<option key={d} value={d}>{d}</option>))}
                              </select>
                              <input type="text" placeholder="City / Village" value={addressSel[field]?.city || ""}
                                onChange={(e) => {
                                  const city = e.target.value;
                                  const state = addressSel[field]?.state || "";
                                  const district = addressSel[field]?.district || "";
                                  const next = { state, district, city };
                                  setAddressSel((p) => ({ ...p, [field]: next }));
                                  setFormData((p) => ({ ...p, [field]: [city, district, state].filter(Boolean).join(", ") }));
                                }}
                                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b", boxSizing: "border-box" }} />
                            </div>
                          ) : (
                            <input type={field === "mailId" ? "email" : "text"} placeholder={field === "mailId" ? "Email ID" : ""}
                              value={formData[field] || ""}
                              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#fff", color: "#1e293b", boxSizing: "border-box" }} />
                          )}
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", gap: "10px" }}>
                        <button type="button" disabled={currentStep === 0}
                          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                          style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: currentStep === 0 ? "#94a3b8" : "#1e293b", fontSize: "14px", cursor: currentStep === 0 ? "default" : "pointer" }}>
                          ← Back
                        </button>
                        {currentStep < Math.ceil(missingFields.length / perStep) - 1 ? (
                          <button type="button" onClick={() => setCurrentStep((s) => s + 1)}
                            style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#ea580c", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                            Next →
                          </button>
                        ) : (
                          <button type="submit"
                            style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#16a34a", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                            Save ✓
                          </button>
                        )}
                      </div>
                      <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" }}>
                        Step {currentStep + 1} of {totalSteps}
                      </p>
                    </form>
                  );
                })()}
              </div>
            </div>
          )}

          <div style={{ padding: "16px 16px 0" }}>

            {/* ── Hero Card ── */}
            <div className="anim-0" style={{
              background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              borderRadius: "20px",
              padding: "18px 16px",
              color: "#fff",
              marginBottom: "14px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* decorative circles */}
              <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", right: 40, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

              <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
                <div className="hero-pulse" style={{
                  width: 56, height: 56, borderRadius: "50%",
                  border: "2.5px solid rgba(255,255,255,0.6)",
                  overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.2)",
                }}>
                  <img
                    src={userData.photoUrl && userData.photoUrl.startsWith("http") ? userData.photoUrl : "/default-avatar.jpg"}
                    alt={userData.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", opacity: 0.8 }}>Welcome back</p>
                  <p style={{ margin: "0 0 2px", fontSize: "17px", fontWeight: 600 }}>{userData.name}</p>
                  <p style={{ margin: 0, fontSize: "12px", opacity: 0.75 }}>ID: {userData.userId}</p>
                </div>
                <span className="badge-pop" style={{
                  background: "rgba(255,255,255,0.2)", borderRadius: "20px",
                  padding: "5px 10px", fontSize: "11px", fontWeight: 600,
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  Sri Veerashiva
                </span>
              </div>

              <div style={{
                marginTop: "14px", paddingTop: "12px",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                display: "flex", gap: "4px", position: "relative", zIndex: 1,
              }}>
                {[
                  { val: grandTotalAll, lbl: "Total members" },
                  { val: memberData.length, lbl: "Peethas" },
                  { val: 3, lbl: "Levels" },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 2px" }}>{s.val}</p>
                    <p style={{ fontSize: "10px", opacity: 0.75, margin: 0 }}>{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Count Pills ── */}
            <p className="section-label anim-1">Member counts</p>
            <div className="anim-1" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {[
                { val: l2TotalAll, lbl: "Prabhu Shivacharya", color: "#ea580c" },
                { val: l3TotalAll, lbl: "Guru Jangam", color: "#16a34a" },
                { val: l4TotalAll, lbl: "Sri Veerashiva", color: "#2563eb" },
              ].map((s, i) => (
                <div key={i} className="stat-chip">
                  <span style={{ fontSize: "22px", fontWeight: 600, color: s.color }}>{s.val}</span>
                  <span style={{ fontSize: "10px", color: "#64748b", textAlign: "center", lineHeight: 1.3 }}>{s.lbl}</span>
                </div>
              ))}
            </div>

            {/* ── Peetha Selector ── */}
            <p className="section-label anim-2">Select peetha</p>
            <div className="peeta-scroll anim-2" style={{ marginBottom: "14px" }}>
              {memberData.map((member, index) => {
                const color = peethaColors[index % peethaColors.length];
                const pNorm = norm(member.l1User.peeta || "");
                const imgMatch = peetaImageBySubstring.find(({ key }) => pNorm.includes(key));
                const imgUrl = imgMatch ? imgMatch.img : "/img2.jpg";
                const isActive = selectedPeethaIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedPeethaIndex(index)}
                    className={`peeta-chip-btn chip-item${isActive ? " active" : ""}`}
                    style={{ animationDelay: `${index * 0.06}s` }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: color.bg, overflow: "hidden",
                      border: isActive ? "2px solid #ea580c" : "2px solid transparent",
                    }}>
                      <img src={imgUrl} alt={member.l1User.peeta}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                        onError={(e) => { e.currentTarget.src = "/img2.jpg"; }} />
                    </div>
                    <span style={{ fontSize: "9px", color: isActive ? "#ea580c" : "#64748b", textAlign: "center", lineHeight: 1.2, fontWeight: isActive ? 600 : 400 }}>
                      {member.l1User.peeta}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Peetha Detail Card ── */}
            {selectedMember && (
              <div className="mobile-card anim-3" style={{ padding: "14px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: peethaColors[selectedPeethaIndex! % peethaColors.length].bg,
                    overflow: "hidden",
                  }}>
                    <img
                      src={(() => {
                        const m = peetaImageBySubstring.find(({ key }) => norm(selectedMember.l1User.peeta).includes(key));
                        return m ? m.img : "/img2.jpg";
                      })()}
                      alt={selectedMember.l1User.peeta}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                      onError={(e) => { e.currentTarget.src = "/img2.jpg"; }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>{selectedMember.l1User.peeta}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Sri 1008 Jagadguru</p>
                  </div>
                  <span style={{
                    background: peethaColors[selectedPeethaIndex! % peethaColors.length].bg,
                    color: peethaColors[selectedPeethaIndex! % peethaColors.length].text,
                    borderRadius: "20px", padding: "4px 10px", fontSize: "11px", fontWeight: 600,
                  }}>
                    Total: {selTotal}
                  </span>
                </div>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th style={{ textAlign: "right" }}>Count</th>
                      <th style={{ textAlign: "right" }}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { lbl: "Prabhu Shivacharya", val: selectedMember.l2UserCount ?? 0 },
                      { lbl: "Guru Jangam", val: selectedMember.l3UserCount ?? 0 },
                      { lbl: "Sri Veerashiva", val: selectedMember.l4UserCount ?? 0 },
                      { lbl: "Total", val: selTotal },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td>{row.lbl}</td>
                        <td style={{ textAlign: "right" }}>{row.val}</td>
                        <td style={{ textAlign: "right", color: "#64748b" }}>
                          {i < 3 ? `${selTotal > 0 ? Math.round((row.val / selTotal) * 100) : 0}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Membership Card ── */}
            <p className="section-label anim-4">Your membership card</p>

            {/* Front / Back toggle */}
            <div className="anim-4" style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              {(["front", "back"] as const).map((side) => (
                <button key={side} onClick={() => setCardSide(side)} style={{
                  flex: 1, padding: "9px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  border: cardSide === side ? "none" : "1.5px solid #e2e8f0",
                  background: cardSide === side ? "linear-gradient(135deg,#ea580c,#c2410c)" : "#fff",
                  color: cardSide === side ? "#fff" : "#64748b",
                  transition: "all 0.2s",
                  boxShadow: cardSide === side ? "0 4px 12px rgba(234,88,12,0.3)" : "none",
                }}>
                  {side === "front" ? "🪪 Front" : "🔁 Back"}
                </button>
              ))}
            </div>

            <div id="card-print-area" ref={cardRef}>

              {/* ── FRONT — PAN card size 85.6×53.98mm → 324×204px at 96dpi ── */}
              {cardSide === "front" && (
                <div className="anim-4" style={{
                  width: "100%", maxWidth: "324px", height: "204px", margin: "0 auto 14px",
                  borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column",
                  boxShadow: "0 8px 28px rgba(234,88,12,0.2), 0 2px 8px rgba(0,0,0,0.08)",
                  border: "1.5px solid rgba(234,88,12,0.15)", background: "#fff", position: "relative",
                }}>
                  {/* Card header */}
                  <div style={{
                    background: "linear-gradient(135deg, #ea580c 0%, #c2410c 60%, #9a3412 100%)",
                    padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px",
                    position: "relative", overflow: "hidden", flexShrink: 0,
                  }}>
                    <div style={{ position: "absolute", top: -15, right: -10, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                    <img src="/logomain1.png" alt="Logo"
                      style={{ width: 30, height: 30, objectFit: "contain", borderRadius: "6px", background: "#fff", padding: "2px", flexShrink: 0, zIndex: 1 }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <div style={{ zIndex: 1 }}>
                      <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Sanathana Veera Shiva</p>
                      <p style={{ margin: 0, fontSize: "8px", color: "rgba(255,255,255,0.85)" }}>Lingayatha Dharma • Member Card</p>
                    </div>
                  </div>

                  {/* Watermark */}
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
                    <img src="/logomain1.png" alt="" style={{ opacity: 0.04, width: "45%" }} />
                  </div>

                  {/* Body */}
                  <div style={{ padding: "8px 10px", display: "flex", gap: "10px", alignItems: "flex-start", position: "relative", zIndex: 1, flex: 1, overflow: "hidden" }}>
                    <div style={{ flex: 1 }}>
                      {[
                        { lbl: "Full Name", val: userData.name },
                        { lbl: "Member ID", val: userData.userId },
                        { lbl: "Peetha", val: userData.peeta || "N/A" },
                        { lbl: "DOB", val: userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A" },
                        { lbl: "Phone", val: userData.contactNo },
                      ].map((row, i) => (
                        <div key={i} style={{ marginBottom: "5px" }}>
                          <span style={{ fontSize: "6.5px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", display: "block" }}>{row.lbl}</span>
                          <p style={{ margin: "1px 0 0", fontSize: "10px", color: "#0f172a", fontWeight: 600, lineHeight: 1.2 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                      <div style={{ borderRadius: "6px", overflow: "hidden", border: "2px solid #ea580c", boxShadow: "0 2px 8px rgba(234,88,12,0.3)" }}>
                        <img
                          src={userData.photoUrl && userData.photoUrl.startsWith("http") ? userData.photoUrl : "/default-avatar.jpg"}
                          alt={userData.name}
                          style={{ width: 50, height: 62, objectFit: "cover", display: "block" }}
                          onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; }}
                        />
                      </div>
                      <span style={{ fontSize: "6px", color: "#ef4444", fontWeight: 700, background: "#fef2f2", padding: "1px 4px", borderRadius: "20px", border: "1px solid #fca5a5", whiteSpace: "nowrap" }}>E-KYC PENDING</span>
                    </div>
                  </div>

                  {/* Footer strip */}
                  <div style={{ background: "linear-gradient(90deg,#fef3c7,#fde68a)", padding: "4px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "6.5px", color: "#92400e", fontWeight: 700 }}>SRI VEERASHIVA LINGAYATHA</span>
                    <span style={{ fontSize: "6.5px", color: "#92400e" }}>Valid Member ✓</span>
                  </div>
                </div>
              )}

              {/* ── BACK — PAN card size 85.6×53.98mm → 324×204px at 96dpi ── */}
              {cardSide === "back" && (
                <div className="anim-4" style={{
                  width: "100%", maxWidth: "324px", height: "204px", margin: "0 auto 14px",
                  borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)",
                  border: "1.5px solid #e2e8f0", background: "#fff", position: "relative",
                }}>
                  {/* Back header */}
                  <div style={{
                    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, color: "#fff" }}>MEMBERSHIP BACK</p>
                      <p style={{ margin: 0, fontSize: "8px", color: "rgba(255,255,255,0.6)" }}>ID: {userData.userId}</p>
                    </div>
                    <span style={{ fontSize: "14px" }}>🔱</span>
                  </div>

                  <div style={{ padding: "8px 10px", display: "flex", gap: "10px", alignItems: "center", flex: 1, overflow: "hidden" }}>
                    {/* Info column */}
                    <div style={{ flex: 1 }}>
                      {[
                        { lbl: "Guru", val: userData.karthruGuru || "N/A" },
                        { lbl: "Address", val: userData.permanentAddress || "N/A" },
                        { lbl: "Nationality", val: (userData as unknown as Record<string,string>).nationality || "Indian" },
                        { lbl: "Kula", val: (userData as unknown as Record<string,string>).kula || "N/A" },
                      ].map((row, i) => (
                        <div key={i} style={{ marginBottom: "6px" }}>
                          <span style={{ fontSize: "6.5px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", display: "block" }}>{row.lbl}</span>
                          <p style={{ margin: "1px 0 0", fontSize: "10px", color: "#0f172a", fontWeight: 500, lineHeight: 1.25 }}>{row.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* QR column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                      <div style={{ background: "#fff", padding: "4px", borderRadius: "8px", border: "2px solid #ea580c", boxShadow: "0 2px 8px rgba(234,88,12,0.2)" }}>
                        <QRCodeSVG
                          value={JSON.stringify({ name: userData.name, id: userData.userId, phone: userData.contactNo, dob: userData.dob, guru: userData.selectedL2User })}
                          size={72} level="H" includeMargin={false}
                        />
                      </div>
                      <span style={{ fontSize: "6.5px", color: "#64748b", fontWeight: 600 }}>Scan to verify</span>
                    </div>
                  </div>

                  {/* Footer strip */}
                  <div style={{ background: "linear-gradient(90deg,#fef3c7,#fde68a)", padding: "4px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "6px", color: "#92400e", fontWeight: 700 }}>SANATHANA VEERA SHIVA LINGAYATHA DHARMA</span>
                    <span style={{ fontSize: "8px", color: "#92400e" }}>🔱</span>
                  </div>
                </div>
              )}

            </div>

            {/* ── Action Buttons ── */}
            <div className="anim-5" style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              <button
                onClick={handleDownloadCard}
                style={{
                  flex: 1, padding: "14px", borderRadius: "12px",
                  border: "none", background: "#ea580c", color: "#fff",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}
              >
                ⬇ Download card
              </button>
              <button
                onClick={() => setShowCompleteForm(true)}
                style={{
                  flex: 1, padding: "14px", borderRadius: "12px",
                  border: "1.5px solid #e2e8f0", background: "#fff", color: "#1e293b",
                  fontSize: "14px", fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}
              >
                ✏ Edit profile
              </button>
            </div>

          </div>
        </div>

        <Footer />

        <style jsx global>{`
          @media print {
            body.print-card-only * { visibility: hidden !important; }
            body.print-card-only #card-print-area,
            body.print-card-only #card-print-area * { visibility: visible !important; }
            body.print-card-only #card-print-area { position: absolute; left: 0; top: 0; width: 100%; }
            #card-print-area * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        `}</style>
      </>
    );
  }

  // ── DESKTOP LAYOUT (unchanged original) ─────────────────────────────────────
  const getUserCounts = (member: MemberData) => [
    member.l2UserCount ?? 0,
    member.l3UserCount ?? 0,
    member.l4UserCount ?? 0,
    (member.l2UserCount ?? 0) + (member.l3UserCount ?? 0) + (member.l4UserCount ?? 0),
  ];
  const userTypeFullLabels = ["Sri 108 Prabhu shivachrya", "Sri guru Jangam", "Sri Veerashiva", "Total"];

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
                        const stored = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "" : "";
                        const payload: Record<string, string> = {};
                        missingFields.forEach((k) => { if (formData[k] !== undefined && formData[k] !== "") payload[k] = formData[k]; });
                        const res = await fetch(`/api/l4/update-profile/${stored}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data?.message || "Failed to update");
                        const refreshed = await fetch(`/api/l4/dashboard/${stored}?timestamp=${Date.now()}`, { cache: "no-store" });
                        if (refreshed.ok) {
                          const ud = await refreshed.json();
                          setUserData(ud);
                          setProfileIncomplete(false);
                          setMissingFields([]);
                          setFormData({});
                          setShowCompleteForm(false);
                          setCurrentStep(0);
                        }
                      } catch (err) { console.error(err); }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {fieldsForStep.map((field) => (
                      <div key={field} className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">{displayLabel(field)}</label>
                        {field === "dob" ? (
                          <input type="date" value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" />
                        ) : field === "gender" ? (
                          <select value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : field === "sonOf" ? (
                          <div className="flex gap-2">
                            <select value={sonOfTitle} onChange={(e) => { const t = e.target.value; setSonOfTitle(t); setFormData((p) => ({ ...p, sonOf: t && sonOfName ? `${t} ${sonOfName}` : "" })); }} className="p-2 border rounded bg-white text-black">
                              <option value="">Select</option>
                              <option value="S/O">S/O</option>
                              <option value="D/O">D/O</option>
                              <option value="W/O">W/O</option>
                            </select>
                            <input type="text" placeholder="Name" value={sonOfName}
                              onChange={(e) => { const n = e.target.value; setSonOfName(n); setFormData((p) => ({ ...p, sonOf: sonOfTitle && n ? `${sonOfTitle} ${n}` : "" })); }}
                              className="flex-1 p-2 border rounded bg-white text-black" />
                          </div>
                        ) : field === "kula" ? (
                          <select value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value, subKula: "" })} className="p-2 border rounded bg-white text-black">
                            <option value="">Select Kula</option>
                            <option value="Veerashaiva Lingayatha">Veerashaiva Lingayatha / ವೀರಶೈವ ಲಿಂಗಾಯತ</option>
                          </select>
                        ) : field === "subKula" ? (
                          <select value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" disabled={!formData["kula"]}>
                            <option value="">Select Sub Kula</option>
                            <option value="Panchamasaligaru">Panchamasaligaru / ಪಂಚಮಸಾಲಿಗರು</option>
                            <option value="Banajigaru">Banajigaru / ಬಣಜಿಗರು</option>
                            <option value="Kadi - vakkaligaru">Kadi - vakkaligaru / ಕಡಿ - ವಕ್ಕಲಿಗರು</option>
                            <option value="Kumbararu">Kumbararu / ಕುಂಬಾರರು</option>
                            <option value="Madivalaru">Madivalaru / ಮಡಿವಾಳರು</option>
                            <option value="Lalagondaru">Lalagondaru / ಲಾಲಗೊಂಡರು</option>
                            <option value="Pakanaka reddy">Pakanaka reddy / ಪಕನಕ ರೆಡ್ಡಿ</option>
                            <option value="Reddy">Reddy / ರೆಡ್ಡಿ</option>
                            <option value="Gaanigaru">Gaanigaru / ಗಾಣಿಗರು</option>
                            <option value="Sadharu">Sadharu / ಸಧರು</option>
                            <option value="Nonabaru">Nonabaru / ನೊನಬಾರು</option>
                            <option value="Shetty ligayatha">Shetty ligayatha / ಶೆಟ್ಟಿ ಲಿಗಾಯತ</option>
                            <option value="Gouda lingyatha">Gouda lingyatha / ಗೌಡ ಲಿಂಗಾಯತ</option>
                          </select>
                        ) : field === "photoUrl" ? (
                          <div className="space-y-2">
                            <input type="text" placeholder="https://..." value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" />
                            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImageUpload(f); }} className="p-1" />
                            {(formData[field] || userData?.photoUrl) && (
                              <img src={(formData[field] || userData?.photoUrl) as string} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                            )}
                          </div>
                        ) : field.toLowerCase().includes("address") ? (
                          <div className="space-y-2">
                            <select value={addressSel[field]?.state || ""}
                              onChange={(e) => { const state = e.target.value; const next = { state, district: "", city: addressSel[field]?.city || "" }; setAddressSel((p) => ({ ...p, [field]: next })); setFormData((p) => ({ ...p, [field]: [next.city, "", state].filter(Boolean).join(", ") })); }}
                              className="p-2 border rounded bg-white text-black">
                              <option value="">Select State</option>
                              {Object.keys(districtsMap).map((st) => (<option key={st} value={st}>{st}</option>))}
                            </select>
                            <select value={addressSel[field]?.district || ""}
                              onChange={(e) => { const district = e.target.value; const state = addressSel[field]?.state || ""; const city = addressSel[field]?.city || ""; const next = { state, district, city }; setAddressSel((p) => ({ ...p, [field]: next })); setFormData((p) => ({ ...p, [field]: [city, district, state].filter(Boolean).join(", ") })); }}
                              className="p-2 border rounded bg-white text-black" disabled={!addressSel[field]?.state}>
                              <option value="">Select District</option>
                              {(districtsMap[addressSel[field]?.state || ""] || []).map((d) => (<option key={d} value={d}>{d}</option>))}
                            </select>
                            <input type="text" placeholder="City / Village" value={addressSel[field]?.city || ""}
                              onChange={(e) => { const city = e.target.value; const state = addressSel[field]?.state || ""; const district = addressSel[field]?.district || ""; const next = { state, district, city }; setAddressSel((p) => ({ ...p, [field]: next })); setFormData((p) => ({ ...p, [field]: [city, district, state].filter(Boolean).join(", ") })); }}
                              className="p-2 border rounded bg-white text-black" />
                          </div>
                        ) : (
                          <input type={field === "mailId" ? "email" : "text"} placeholder={field === "mailId" ? "Email ID" : ""} value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="p-2 border rounded bg-white text-black" />
                        )}
                      </div>
                    ))}
                    <div className="sm:col-span-2 flex justify-between mt-2">
                      <button type="button" onClick={() => setShowCompleteForm(false)} className="px-4 py-2 rounded bg-gray-200 text-gray-800">Close</button>
                      <div className="flex gap-2">
                        <button type="button" disabled={currentStep === 0} onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} className={`px-4 py-2 rounded ${currentStep === 0 ? "bg-gray-300 text-gray-400" : "bg-blue-100 text-blue-800"}`}>Back</button>
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
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-16">Dashboard</h1>
        <div className="overflow-x-auto mx-auto max-w-[90%] sm:max-w-[95%] mt-10">
          <table className="w-full border-collapse border border-gray-800 bg-white shadow-lg text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="border border-gray-800 p-1 sm:p-2 bg-orange-600 text-white text-center min-w-[120px] h-[150px]">
                  Sri 1008 Jagdguru Peeta श्री 1008 जगद्गुरु पीठ ಶ್ರೀ ೧೦೦೮ ಜಗದ್ಗುರು ಪೀಠ
                </th>
                {memberData.map((member, index) => {
                  const bgColors = ["bg-green-400","bg-red-400","bg-blue-400","bg-gray-300","bg-yellow-300","bg-orange-400"];
                  const pNorm = norm(member.l1User.peeta || "");
                  const imgM = peetaImageBySubstring.find(({ key }) => pNorm.includes(key));
                  const imageUrl = imgM ? imgM.img : "/img2.jpg";
                  return (
                    <th key={index} className={`border border-gray-800 p-1 sm:p-2 text-center text-white min-w-[120px] h-[150px] ${bgColors[index % bgColors.length]}`}>
                      <div className="flex flex-col items-center">
                        <img src={imageUrl} alt={member.l1User.peeta} className="rounded-full mb-1 object-cover" style={{ width: "65px", height: "100px" }} onError={(e) => { e.currentTarget.src = "/img2.jpg"; }} />
                      </div>
                      <span className="block mt-1 text-sm font-semibold">{member.l1User.peeta}</span>
                    </th>
                  );
                })}
                <th className="border border-gray-800 p-1 sm:p-2 bg-yellow-600 text-white text-center min-w-[80px]">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">Sri 108 Prabhu shivachrya</td>
                {memberData.map((member, index) => (<td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l2UserCount ?? 0}</td>))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l2TotalAll}</td>
              </tr>
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">Sri guru Jangam</td>
                {memberData.map((member, index) => (<td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l3UserCount ?? 0}</td>))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l3TotalAll}</td>
              </tr>
              <tr className="border border-gray-800 hover:bg-yellow-100">
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-medium bg-yellow-100">Sri Veerashiva</td>
                {memberData.map((member, index) => (<td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">{member.l4UserCount ?? 0}</td>))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center font-semibold bg-yellow-50">{l4TotalAll}</td>
              </tr>
              <tr className="border border-gray-800 bg-orange-100 hover:bg-orange-200 font-bold">
                <td className="border border-gray-800 p-1 sm:p-2 text-center">Total</td>
                {memberData.map((member, index) => (
                  <td key={index} className="border border-gray-800 p-1 sm:p-2 text-center">
                    {(member.l2UserCount ?? 0) + (member.l3UserCount ?? 0) + (member.l4UserCount ?? 0)}
                  </td>
                ))}
                <td className="border border-gray-800 p-1 sm:p-2 text-center">{grandTotalAll}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <img src="/logomain1.png" alt="Logo" style={{ width: "150px", height: "150px" }} />
          <h1 className="font-bold text-black text-lg sm:text-2xl flex items-center">
            <strong className="text-6xl sm:text-8xl font-extrabold" style={{ letterSpacing: "5px" }}>&rarr;</strong>
            <span className="ml-4 text-3xl mt-3">Total: {grandTotalAll}</span>
          </h1>
        </div>
        <br />
        <div className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-4 flex justify-end">
          <button
            onClick={handleDownloadCard}
            style={{
              padding: "10px 24px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg,#ea580c,#c2410c)", color: "#fff",
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(234,88,12,0.35)",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            ⬇ Download Card
          </button>
        </div>

        {/* ID Card — front + back side by side */}
        <div id="card-print-area" className="mx-auto max-w-[90%] sm:max-w-[1000px] mt-4 mb-10" ref={cardRef}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" }}>Membership ID Card</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}>

            {/* ── FRONT ── */}
            <div>
              <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#ea580c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>◼ Front</p>
              {/* PAN card size: 85.6×53.98 mm → displayed at 1.5× = 486×306 px */}
              <div style={{
                width: "486px", height: "306px", borderRadius: "14px", overflow: "hidden",
                boxShadow: "0 12px 40px rgba(234,88,12,0.2), 0 2px 8px rgba(0,0,0,0.10)",
                border: "1.5px solid rgba(234,88,12,0.18)", background: "#fff",
                position: "relative", display: "flex", flexDirection: "column",
              }}>
                {/* Watermark */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
                  <img src="/logomain1.png" alt="" style={{ opacity: 0.05, width: "45%" }} />
                </div>
                {/* Header */}
                <div style={{ background: "linear-gradient(135deg,#ea580c 0%,#c2410c 60%,#9a3412 100%)", padding: "8px 14px", display: "flex", alignItems: "center", gap: "10px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: -20, right: -15, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                  <img src="/logomain1.png" alt="Logo" style={{ width: 38, height: 38, objectFit: "contain", borderRadius: "8px", background: "#fff", padding: "3px", flexShrink: 0, zIndex: 1 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div style={{ zIndex: 1 }}>
                    <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Sanathana Veera Shiva</p>
                    <p style={{ margin: 0, fontSize: "9.5px", color: "rgba(255,255,255,0.85)" }}>Lingayatha Dharma • Member Card</p>
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding: "10px 14px", display: "flex", gap: "12px", alignItems: "flex-start", position: "relative", zIndex: 1, flex: 1, overflow: "hidden" }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { lbl: "Full Name", val: userData.name },
                      { lbl: "Member ID", val: userData.userId },
                      { lbl: "Peetha", val: userData.peeta || "N/A" },
                      { lbl: "Date of Birth", val: userData.dob && !isNaN(Date.parse(userData.dob)) ? new Date(userData.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A" },
                      { lbl: "Phone", val: userData.contactNo },
                    ].map((row, i) => (
                      <div key={i} style={{ marginBottom: "7px" }}>
                        <span style={{ fontSize: "7.5px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>{row.lbl}</span>
                        <p style={{ margin: "1px 0 0", fontSize: "11.5px", color: "#0f172a", fontWeight: 600, lineHeight: 1.2 }}>{row.val}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <div style={{ borderRadius: "8px", overflow: "hidden", border: "2.5px solid #ea580c", boxShadow: "0 4px 10px rgba(234,88,12,0.3)" }}>
                      <img
                        src={userData.photoUrl && userData.photoUrl.startsWith("http") ? userData.photoUrl : "/default-avatar.jpg"}
                        alt={userData.name}
                        style={{ width: 72, height: 90, objectFit: "cover", display: "block" }}
                        onError={(e) => { e.currentTarget.src = "/default-avatar.jpg"; }}
                      />
                    </div>
                    <span style={{ fontSize: "7px", color: "#ef4444", fontWeight: 700, background: "#fef2f2", padding: "1px 6px", borderRadius: "20px", border: "1px solid #fca5a5", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>E-KYC PENDING</span>
                  </div>
                </div>
                {/* Footer */}
                <div style={{ background: "linear-gradient(90deg,#fef3c7,#fde68a)", padding: "5px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "7.5px", color: "#92400e", fontWeight: 700 }}>SRI VEERASHIVA LINGAYATHA</span>
                  <span style={{ fontSize: "7.5px", color: "#92400e" }}>Valid Member ✓</span>
                </div>
              </div>
            </div>

            {/* ── BACK ── */}
            <div>
              <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>◼ Back</p>
              {/* PAN card size: 85.6×53.98 mm → displayed at 1.5× = 486×306 px */}
              <div style={{
                width: "486px", height: "306px", borderRadius: "14px", overflow: "hidden",
                boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                border: "1.5px solid #e2e8f0", background: "#fff",
                position: "relative", display: "flex", flexDirection: "column",
              }}>
                {/* Back header */}
                <div style={{ background: "linear-gradient(135deg,#1e293b 0%,#334155 100%)", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#fff" }}>MEMBERSHIP BACK</p>
                    <p style={{ margin: 0, fontSize: "9px", color: "rgba(255,255,255,0.6)" }}>Sanathana Veera Shiva Lingayatha Dharma</p>
                  </div>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)" }}>🔱</span>
                </div>
                {/* Body */}
                <div style={{ padding: "10px 14px", display: "flex", gap: "14px", alignItems: "center", flex: 1, overflow: "hidden" }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { lbl: "Guru", val: userData.karthruGuru || "N/A" },
                      { lbl: "Permanent Address", val: userData.permanentAddress || "N/A" },
                      { lbl: "Nationality", val: (userData as unknown as Record<string,string>).nationality || "Indian" },
                      { lbl: "Kula", val: (userData as unknown as Record<string,string>).kula || "N/A" },
                    ].map((row, i) => (
                      <div key={i} style={{ marginBottom: "9px" }}>
                        <span style={{ fontSize: "7.5px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block" }}>{row.lbl}</span>
                        <p style={{ margin: "1px 0 0", fontSize: "11.5px", color: "#0f172a", fontWeight: 500, lineHeight: 1.3 }}>{row.val}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <div style={{ background: "#fff", padding: "5px", borderRadius: "10px", border: "2px solid #ea580c", boxShadow: "0 4px 10px rgba(234,88,12,0.2)" }}>
                      <QRCodeSVG
                        value={JSON.stringify({ name: userData.name, id: userData.userId, phone: userData.contactNo, dob: userData.dob, guru: userData.selectedL2User })}
                        size={110} level="H" includeMargin={false}
                      />
                    </div>
                    <span style={{ fontSize: "7.5px", color: "#64748b", fontWeight: 600 }}>Scan to verify</span>
                  </div>
                </div>
                {/* Footer */}
                <div style={{ background: "linear-gradient(90deg,#fef3c7,#fde68a)", padding: "5px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "7px", color: "#92400e", fontWeight: 700 }}>SANATHANA VEERA SHIVA LINGAYATHA DHARMA</span>
                  <span style={{ fontSize: "9px", color: "#92400e" }}>🔱</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <br />
        <br />
      </div>
      <Footer />
      <style jsx global>{`
        @media print {
          body.print-card-only * { visibility: hidden !important; }
          body.print-card-only #card-print-area,
          body.print-card-only #card-print-area * { visibility: visible !important; }
          body.print-card-only #card-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          #card-print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #card-print-area [style*="ea580c"] {
            background-color: #ea580c !important;
            color: #ffffff !important;
          }
        }
      `}</style>
    </>
  );
}