"use client";
import { useState, useEffect, useCallback } from "react";

type AdminStep = "otp-send" | "otp-verify" | "password" | "dashboard";
type ActiveTab = "transactions" | "users";
type UserLevel = "all" | "l1" | "l2" | "l3" | "l4";

interface Transaction {
  _id: string;
  fromUserId: string;
  toUserId: string;
  fromName: string;
  toName: string;
  amount: number;
  type: string;
  note: string;
  userLevel: string;
  createdAt: string;
}

interface Stats {
  l2Total: number;
  l3Total: number;
  l4Total: number;
  grandTotal: number;
  totalTransactions: number;
}

interface AdminUser {
  _id: string;
  userId: string;
  name: string;
  contactNo: string;
  peeta?: string;
  gender?: string;
  walletBalance?: number;
  createdAt: string;
  _level: "L1" | "L2" | "L3" | "L4";
}

interface LevelCounts {
  l1: number;
  l2: number;
  l3: number;
  l4: number;
}

const TYPE_COLORS: Record<string, string> = {
  signup_bonus: "#86efac",
  admin_credit: "#fcd34d",
  transfer: "#93c5fd",
};

const TYPE_LABELS: Record<string, string> = {
  signup_bonus: "🎁 Signup Bonus",
  admin_credit: "👑 Admin Credit",
  transfer: "🔄 Transfer",
};

// ─── Wrapper is defined at MODULE scope so it never recreates on re-render ────
// (Defining it inside the component causes React to unmount/remount on every
//  state change, which kills input focus after each keystroke.)
function AdminPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      padding: "40px 16px",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>🏦</div>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Rudhra Wallet Admin
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "6px 0 0" }}>
          Sanathana Veerashaiva Ligayatha Trust
        </p>
      </div>
      {children}
    </div>
  );
}

export default function AdminWalletPage() {
  const [step, setStep] = useState<AdminStep>("otp-send");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dashLoading, setDashLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>("transactions");

  // Users tab state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel>("all");
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [levelCounts, setLevelCounts] = useState<LevelCounts | null>(null);

  // Credit form
  const [creditUserId, setCreditUserId] = useState("");
  const [creditPhone, setCreditPhone] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditNote, setCreditNote] = useState("");
  const [creditMsg, setCreditMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [crediting, setCrediting] = useState(false);

  // ── STEP 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/wallet/admin/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSessionId(data.sessionId);
        setStep("otp-verify");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setError("Enter the OTP"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/wallet/admin/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", sessionId: otpSessionId, otp }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setStep("password");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: Password ─────────────────────────────────────────────────────
  const handlePassword = async () => {
    if (!password.trim()) { setError("Enter the admin password"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/wallet/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdminToken(data.token);
        setStep("dashboard");
      } else {
        setError(data.message || "Incorrect password");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // ── Dashboard: Fetch transactions ─────────────────────────────────────────
  const fetchTransactions = useCallback(async (p = 1) => {
    setDashLoading(true);
    try {
      const res = await fetch(`/api/wallet/admin/transactions?page=${p}`, {
        headers: { "x-admin-token": adminToken },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions);
        setStats(data.stats);
        setPage(data.page);
        setTotalPages(data.totalPages);
      }
    } catch {
      /* noop */
    } finally {
      setDashLoading(false);
    }
  }, [adminToken]);

  // ── Users: Fetch ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (p = 1, level: UserLevel = userLevel, search = userSearch) => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), level, ...(search ? { search } : {}) });
      const res = await fetch(`/api/wallet/admin/users?${params}`, {
        headers: { "x-admin-token": adminToken },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setUserPage(data.page);
        setUserTotalPages(data.totalPages);
        setUserTotal(data.total);
        if (data.levelCounts) setLevelCounts(data.levelCounts);
      }
    } catch { /* noop */ }
    finally { setUsersLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken, userLevel, userSearch]);

  useEffect(() => {
    if (step === "dashboard" && adminToken) {
      fetchTransactions(1);
      fetchUsers(1, "all", "");
    }
  }, [step, adminToken, fetchTransactions, fetchUsers]);

  // ── Credit user ───────────────────────────────────────────────────────────
  const handleCredit = async () => {
    if (!creditAmount || (!creditUserId && !creditPhone)) {
      setCreditMsg({ type: "error", text: "Enter userId or phone, and amount" });
      return;
    }
    setCrediting(true); setCreditMsg(null);
    try {
      const res = await fetch("/api/wallet/admin/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify({
          userId: creditUserId || undefined,
          phone: creditPhone || undefined,
          amount: Number(creditAmount),
          note: creditNote || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreditMsg({ type: "success", text: data.message });
        setCreditUserId(""); setCreditPhone(""); setCreditAmount(""); setCreditNote("");
        await fetchTransactions(page);
      } else {
        setCreditMsg({ type: "error", text: data.message || "Credit failed" });
      }
    } catch {
      setCreditMsg({ type: "error", text: "Network error" });
    } finally {
      setCrediting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    marginTop: "6px",
  };

  const btnStyle = (disabled = false): React.CSSProperties => ({
    padding: "13px",
    borderRadius: "12px",
    border: "none",
    background: disabled ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #ea580c, #c2410c)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 4px 20px rgba(234,88,12,0.4)",
    width: "100%",
    marginTop: "16px",
    transition: "all 0.2s",
  });

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    maxWidth: "440px",
    margin: "0 auto",
  };

  // ─── Common page wrapper ──────────────────────────────────────────────────
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      padding: "40px 16px",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>🏦</div>
        <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Rudhra Wallet Admin
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "6px 0 0" }}>
          Sanathana Veerashaiva Ligayatha Trust
        </p>
      </div>
      {children}
    </div>
  );

  // ─── STEP: Send OTP ───────────────────────────────────────────────────────
  if (step === "otp-send") {
    return (
      <AdminPageWrapper>
        <div style={cardStyle}>
          {/* Progress */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                flex: 1, height: "4px", borderRadius: "2px",
                background: n === 1 ? "#ea580c" : "rgba(255,255,255,0.15)",
              }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px" }}>📱</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "12px 0 8px" }}>
              Verify Your Identity
            </h2>
            {/* <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
              An OTP will be sent to<br />
              <strong style={{ color: "rgba(255,255,255,0.8)" }}>+91 78923 43128</strong>
            </p> */}
          </div>
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", fontSize: "13px", marginBottom: "12px" }}>
              ❌ {error}
            </div>
          )}
          <button id="admin-send-otp" onClick={handleSendOtp} disabled={loading} style={btnStyle(loading)}>
            {loading ? "Sending..." : "Send OTP "}
          </button>
        </div>
      </AdminPageWrapper>
    );
  }

  // ─── STEP: Verify OTP ────────────────────────────────────────────────────
  if (step === "otp-verify") {
    return (
      <AdminPageWrapper>
        <div style={cardStyle}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                flex: 1, height: "4px", borderRadius: "2px",
                background: n <= 2 ? "#ea580c" : "rgba(255,255,255,0.15)",
              }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px" }}>🔢</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "12px 0 8px" }}>
              Enter OTP
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
              6-digit code sent to your registered number
            </p>
          </div>
          <input
            id="admin-otp-input"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            style={{ ...inputStyle, textAlign: "center", fontSize: "24px", letterSpacing: "6px", fontWeight: 700 }}
          />
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", fontSize: "13px", marginTop: "12px" }}>
              ❌ {error}
            </div>
          )}
          <button id="admin-verify-otp" onClick={handleVerifyOtp} disabled={loading || otp.length < 4} style={btnStyle(loading || otp.length < 4)}>
            {loading ? "Verifying..." : "Verify OTP →"}
          </button>
          <button onClick={() => { setStep("otp-send"); setOtp(""); setError(""); }}
            style={{ marginTop: "10px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", width: "100%", textAlign: "center" }}>
            ← Resend OTP
          </button>
        </div>
      </AdminPageWrapper>
    );
  }

  // ─── STEP: Password ───────────────────────────────────────────────────────
  if (step === "password") {
    return (
      <AdminPageWrapper>
        <div style={cardStyle}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ flex: 1, height: "4px", borderRadius: "2px", background: "#ea580c" }} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px" }}>🔐</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "12px 0 8px" }}>
              Admin Password
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
              OTP verified ✅ — Enter your admin password
            </p>
          </div>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em" }}>PASSWORD</label>
          <input
            id="admin-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            onKeyDown={(e) => e.key === "Enter" && handlePassword()}
            style={inputStyle}
          />
          {error && (
            <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", fontSize: "13px", marginTop: "12px" }}>
              ❌ {error}
            </div>
          )}
          <button id="admin-password-submit" onClick={handlePassword} disabled={loading} style={btnStyle(loading)}>
            {loading ? "Checking..." : "Enter Admin Panel 🚀"}
          </button>
        </div>
      </AdminPageWrapper>
    );
  }

  // ─── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      padding: "0",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Top bar */}
      <div style={{
        background: "rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, margin: 0 }}>🏦 Rudhra Wallet Admin</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "2px 0 0" }}>
            Sanathana Veerashaiva Ligayatha Trust
          </p>
        </div>
        <button
          onClick={() => { setStep("otp-send"); setAdminToken(""); setOtp(""); setPassword(""); }}
          style={{
            padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)",
            fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}
        >
          🔒 Logout
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ padding: "0 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "24px", marginTop: "20px" }}>
          {(["transactions", "users"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 22px",
                background: activeTab === tab ? "rgba(234,88,12,0.15)" : "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #ea580c" : "2px solid transparent",
                color: activeTab === tab ? "#ea580c" : "rgba(255,255,255,0.45)",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
                transition: "all 0.2s",
              }}
            >
              {tab === "transactions" ? "💳 Transactions" : "👥 Users"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px 24px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Stats Cards + Transactions (shown when transactions tab active) ── */}
        {activeTab === "transactions" && (
          <>
          {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "28px" }}>
            {[
              { label: "L2 Total Balance", value: `₹${stats.l2Total.toLocaleString("en-IN")}`, color: "#86efac" },
              { label: "L3 Total Balance", value: `₹${stats.l3Total.toLocaleString("en-IN")}`, color: "#93c5fd" },
              { label: "L4 Total Balance", value: `₹${stats.l4Total.toLocaleString("en-IN")}`, color: "#fcd34d" },
              { label: "Grand Total", value: `₹${stats.grandTotal.toLocaleString("en-IN")}`, color: "#f9a8d4" },
              { label: "Total Transactions", value: stats.totalTransactions.toString(), color: "#c4b5fd" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "14px",
                padding: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
              }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600, margin: "0 0 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {s.label}
                </p>
                <p style={{ color: s.color, fontSize: "22px", fontWeight: 800, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

          {/* ── Transactions Table ── */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: 0 }}>All Transactions</h2>
              <button onClick={() => fetchTransactions(page)} style={{
                padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: "12px", cursor: "pointer",
              }}>
                🔄 Refresh
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    {["Type", "From", "To", "Amount", "Level", "Date"].map((h) => (
                      <th key={h} style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontWeight: 600, textAlign: "left", fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashLoading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
                        Loading...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>
                        No transactions yet
                      </td>
                    </tr>
                  ) : transactions.map((tx, i) => (
                    <tr key={tx._id} style={{
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                          background: `${TYPE_COLORS[tx.type] || "#e5e7eb"}22`,
                          color: TYPE_COLORS[tx.type] || "#e5e7eb",
                          whiteSpace: "nowrap",
                        }}>
                          {TYPE_LABELS[tx.type] || tx.type}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
                        <span style={{ display: "block", fontWeight: 600, color: "#fff", fontSize: "12px" }}>{tx.fromName}</span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{tx.fromUserId}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
                        <span style={{ display: "block", fontWeight: 600, color: "#fff", fontSize: "12px" }}>{tx.toName}</span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{tx.toUserId}</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 800, color: "#86efac", whiteSpace: "nowrap" }}>
                        ₹{tx.amount}
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <span style={{
                          padding: "1px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 600,
                          background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)",
                          textTransform: "uppercase",
                        }}>
                          {tx.userLevel || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.45)", fontSize: "11px", whiteSpace: "nowrap" }}>
                        {new Date(tx.createdAt).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "center", gap: "8px" }}>
                <button
                  disabled={page === 1}
                  onClick={() => fetchTransactions(page - 1)}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}
                >
                  ← Prev
                </button>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", display: "flex", alignItems: "center" }}>
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => fetchTransactions(page + 1)}
                  style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px" }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* ── Credit User Panel ── */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "20px",
          }}>
            <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: "0 0 16px" }}>
              👑 Credit User
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>User ID</label>
                <input value={creditUserId} onChange={(e) => setCreditUserId(e.target.value)}
                  placeholder="e.g. ABCD1234" style={{ ...inputStyle, fontSize: "13px", padding: "10px 14px" }} />
              </div>
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>— OR —</div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Phone Number</label>
                <input value={creditPhone} onChange={(e) => setCreditPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit phone" maxLength={10} style={{ ...inputStyle, fontSize: "13px", padding: "10px 14px" }} />
              </div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Amount (₹)</label>
                <input type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="Amount to credit" min={1} style={{ ...inputStyle, fontSize: "13px", padding: "10px 14px" }} />
              </div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Note (optional)</label>
                <input value={creditNote} onChange={(e) => setCreditNote(e.target.value)}
                  placeholder="Reason for credit…" style={{ ...inputStyle, fontSize: "13px", padding: "10px 14px" }} />
              </div>
              {creditMsg && (
                <div style={{
                  padding: "10px 14px", borderRadius: "8px",
                  background: creditMsg.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${creditMsg.type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                  color: creditMsg.type === "success" ? "#86efac" : "#fca5a5",
                  fontSize: "12px",
                }}>
                  {creditMsg.type === "success" ? "✅ " : "❌ "}{creditMsg.text}
                </div>
              )}
              <button
                id="admin-credit-submit"
                onClick={handleCredit}
                disabled={crediting}
                style={{ ...btnStyle(crediting), marginTop: "4px", fontSize: "13px", padding: "11px" }}
              >
                {crediting ? "Crediting..." : "Credit Rudhra ₹"}
              </button>
            </div>
          </div>
          </div>
          </>
        )}

        {/* ══════════════════ USERS TAB ══════════════════ */}
        {activeTab === "users" && (
          <div>
            {/* Level count summary */}
            {levelCounts && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                {[
                  { label: "L1 – Swami", count: levelCounts.l1, color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
                  { label: "L2 – Prabhu Shivacharya", count: levelCounts.l2, color: "#ea580c", bg: "rgba(234,88,12,0.1)" },
                  { label: "L3 – Guru Jangam", count: levelCounts.l3, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
                  { label: "L4 – Sri Veerashiva", count: levelCounts.l4, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
                  { label: "Total Members", count: levelCounts.l1 + levelCounts.l2 + levelCounts.l3 + levelCounts.l4, color: "#c4b5fd", bg: "rgba(196,181,253,0.1)" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: s.bg,
                    border: `1px solid ${s.color}33`,
                    borderRadius: "14px",
                    padding: "14px 16px",
                    textAlign: "center",
                  }}>
                    <p style={{ color: s.color, fontSize: "26px", fontWeight: 800, margin: "0 0 4px" }}>{s.count}</p>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Filter + Search bar */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {(["all", "l1", "l2", "l3", "l4"] as UserLevel[]).map((lv) => {
                  const colors: Record<UserLevel, string> = { all: "#c4b5fd", l1: "#f472b6", l2: "#ea580c", l3: "#22c55e", l4: "#3b82f6" };
                  const isActive = userLevel === lv;
                  return (
                    <button
                      key={lv}
                      onClick={() => {
                        setUserLevel(lv);
                        setUserPage(1);
                        setUserSearch("");
                        fetchUsers(1, lv, "");
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "999px",
                        border: `1px solid ${colors[lv]}${ isActive ? "" : "55"}`,
                        background: isActive ? `${colors[lv]}22` : "transparent",
                        color: isActive ? colors[lv] : "rgba(255,255,255,0.4)",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "uppercase",
                        transition: "all 0.2s",
                      }}
                    >
                      {lv === "all" ? "All" : lv.toUpperCase()}
                    </button>
                  );
                })}
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setUserPage(1);
                      fetchUsers(1, userLevel, userSearch);
                    }
                  }}
                  placeholder="Search by name, ID, or phone… (Enter to search)"
                  style={{ ...inputStyle, fontSize: "13px", padding: "9px 14px", marginTop: 0 }}
                />
              </div>
              <button
                onClick={() => { setUserPage(1); fetchUsers(1, userLevel, userSearch); }}
                style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔍 Search
              </button>
              <button
                onClick={() => fetchUsers(userPage, userLevel, userSearch)}
                style={{ padding: "9px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔄
              </button>
            </div>

            {/* Users Table */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: 0 }}>All Members</h2>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>{userTotal} total</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                      {["Level", "Name", "User ID", "Phone", "Peetha", "Gender", "Wallet", "Joined"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", color: "rgba(255,255,255,0.45)", fontWeight: 600, textAlign: "left", fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.3)" }}>Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.3)" }}>No users found</td></tr>
                    ) : users.map((u, i) => {
                      const lvColors: Record<string, string> = { L1: "#f472b6", L2: "#ea580c", L3: "#22c55e", L4: "#3b82f6" };
                      const c = lvColors[u._level] || "#c4b5fd";
                      return (
                        <tr key={u._id || i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: `${c}22`, color: c }}>{u._level}</span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{u.name}</td>
                          <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "rgba(255,255,255,0.5)", fontSize: "11px", whiteSpace: "nowrap" }}>{u.userId}</td>
                          <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>{u.contactNo}</td>
                          <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{u.peeta || "—"}</td>
                          <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.5)", fontSize: "12px", textTransform: "capitalize" }}>{u.gender || "—"}</td>
                          <td style={{ padding: "10px 14px", color: "#86efac", fontWeight: 700, whiteSpace: "nowrap" }}>₹{(u.walletBalance ?? 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "10px 14px", color: "rgba(255,255,255,0.35)", fontSize: "11px", whiteSpace: "nowrap" }}>
                            {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {userTotalPages > 1 && (
                <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                  <button
                    disabled={userPage === 1}
                    onClick={() => { const p = userPage - 1; setUserPage(p); fetchUsers(p, userLevel, userSearch); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: userPage === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", cursor: userPage === 1 ? "not-allowed" : "pointer", fontSize: "13px" }}
                  >← Prev</button>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{userPage} / {userTotalPages}</span>
                  <button
                    disabled={userPage === userTotalPages}
                    onClick={() => { const p = userPage + 1; setUserPage(p); fetchUsers(p, userLevel, userSearch); }}
                    style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: userPage === userTotalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", cursor: userPage === userTotalPages ? "not-allowed" : "pointer", fontSize: "13px" }}
                  >Next →</button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(234,88,12,0.6) !important; box-shadow: 0 0 0 2px rgba(234,88,12,0.2); }
      `}</style>
    </div>
  );
}
