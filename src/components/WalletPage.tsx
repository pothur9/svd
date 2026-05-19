"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthManager from "@/lib/auth";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Transaction {
  _id: string;
  fromUserId: string;
  toUserId: string;
  fromName: string;
  toName: string;
  amount: number;
  type: string;
  note: string;
  createdAt: string;
}

// ─── Denomination breakdown ───────────────────────────────────────────────────
const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

function breakIntoNotes(balance: number): { denom: number; count: number }[] {
  let remaining = balance;
  const result: { denom: number; count: number }[] = [];
  for (const d of DENOMINATIONS) {
    const count = Math.floor(remaining / d);
    if (count > 0) {
      result.push({ denom: d, count });
      remaining -= count * d;
    }
  }
  return result;
}




// ─── Map each denomination to its real note image ─────────────────────────────
const DENOM_NOTE_SRC: Record<number, string> = {
  500: "/500.jpeg",
  200: "/200.jpg.jpeg",
  100: "/100.jpeg",
  50:  "/50.jpg.jpeg",
  20:  "/20.jpeg",
  10:  "/10.jpeg",
  5:   "/5.jpeg",
  2:   "/2.jpeg",
  1:   "/1.jpeg",
};

const DENOM_TINT: Record<number, string> = {
  500: "transparent",
  200: "transparent",
  100: "transparent",
  50:  "transparent",
  20:  "transparent",
  10:  "transparent",
  5:   "transparent",
  2:   "transparent",
  1:   "transparent",
};

const DENOM_SHADOW: Record<number, string> = {
  500: "rgba(26,35,126,0.40)",
  200: "rgba(27,94,32,0.40)",
  100: "rgba(13,71,161,0.40)",
  50:  "rgba(161,101,13,0.40)",
  20:  "rgba(126,13,84,0.40)",
  10:  "rgba(46,125,50,0.40)",
  5:   "rgba(180,83,9,0.40)",
  2:   "rgba(120,53,15,0.40)",
  1:   "rgba(92,40,9,0.40)",
};

// ─── Currency Note Component ──────────────────────────────────────────────────
function RudhraNote({ denom, count }: { denom: number; count: number }) {
  const src    = DENOM_NOTE_SRC[denom] ?? "/100.jpeg";
  const tint   = DENOM_TINT[denom]    ?? "transparent";
  const shadow = DENOM_SHADOW[denom]  ?? "rgba(0,0,0,0.3)";

  return (
    <div style={{ position: "relative", marginBottom: "8px" }}>
      {/* Stacked paper shadows for count > 1 */}
      {count > 1 && (
        <div style={{
          position: "absolute",
          top: "7px", left: "7px", right: "-7px", bottom: "-7px",
          borderRadius: "12px",
          background: "#d0c8b8",
          boxShadow: `0 4px 16px ${shadow}`,
          zIndex: 0,
        }} />
      )}
      {count > 2 && (
        <div style={{
          position: "absolute",
          top: "14px", left: "14px", right: "-14px", bottom: "-14px",
          borderRadius: "12px",
          background: "#c0b8a8",
          zIndex: 0,
        }} />
      )}

      {/* ── Main note ── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: `0 8px 32px ${shadow}, 0 0 0 1.5px rgba(255,255,255,0.12)`,
        width: "100%",
        maxWidth: "480px",
        userSelect: "none",
        lineHeight: 0,
      }}>
        {/* Actual SVD note photo */}
        <img
          src={src}
          alt={`Rs.${denom} Rudhra note`}
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            borderRadius: "12px",
          }}
          draggable={false}
        />

        {/* Colour-tint overlay for non-exact denominations */}
        {tint !== "transparent" && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: tint,
            borderRadius: "12px",
            pointerEvents: "none",
          }} />
        )}

        {/* Bottom-left: denomination ribbon */}
        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "8px",
          padding: "4px 10px",
          display: "flex",
          alignItems: "baseline",
          gap: "3px",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 400 }}>₹</span>
          <span style={{ color: "#fff", fontSize: "24px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.5px" }}>
            {denom}
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: 600, marginLeft: "4px", letterSpacing: "0.05em" }}>
            RUDHRA
          </span>
        </div>
      </div>

      {/* Count badge — shown when more than 1 note */}
      {count > 1 && (
        <div style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          zIndex: 10,
          background: "linear-gradient(135deg, #ea580c, #c2410c)",
          color: "#fff",
          borderRadius: "50%",
          width: "34px",
          height: "34px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: 900,
          boxShadow: "0 3px 12px rgba(234,88,12,0.55)",
          border: "2.5px solid #fff",
          letterSpacing: "-0.5px",
        }}>
          ×{count}
        </div>
      )}
    </div>
  );
}


// ─── Main Wallet Page ─────────────────────────────────────────────────────────

export default function WalletPage({ level }: { level: "l2" | "l3" | "l4" }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"notes" | "send" | "history">("notes");

  // Send form state
  const [toUserId, setToUserId] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBalance = useCallback(async (uid: string) => {
    const res = await fetch(`/api/wallet/balance?userId=${uid}&level=${level}`);
    if (res.ok) {
      const data = await res.json();
      setBalance(data.walletBalance);
      setUserName(data.name);
    }
  }, [level]);

  const fetchTransactions = useCallback(async (uid: string) => {
    const res = await fetch(`/api/wallet/transactions?userId=${uid}`);
    if (res.ok) {
      const data = await res.json();
      setTransactions(data);
    }
  }, []);

  useEffect(() => {
    if (!AuthManager.isAuthenticated()) {
      router.replace(`/${level}/login`);
      return;
    }
    const uid = AuthManager.getCurrentUserId() || "";
    setUserId(uid);
    Promise.all([fetchBalance(uid), fetchTransactions(uid)]).finally(() => setLoading(false));
  }, [router, level, fetchBalance, fetchTransactions]);

  const handleSend = async () => {
    setSendMsg(null);
    if (!toUserId.trim() || !toPhone.trim() || !amount) {
      setSendMsg({ type: "error", text: "Please fill in all fields" });
      return;
    }
    if (!/^\d{10}$/.test(toPhone)) {
      setSendMsg({ type: "error", text: "Phone must be 10 digits" });
      return;
    }
    const amt = Number(amount);
    if (amt < 10 || amt % 10 !== 0) {
      setSendMsg({ type: "error", text: "Amount must be ₹10 or more and a multiple of 10" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId: userId, toUserId: toUserId.trim(), toPhone: toPhone.trim(), amount: amt }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendMsg({ type: "success", text: data.message });
        setToUserId(""); setToPhone(""); setAmount("");
        setBalance(data.newBalance);
        await fetchTransactions(userId);
      } else {
        setSendMsg({ type: "error", text: data.message || "Transfer failed" });
      }
    } catch {
      setSendMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const notes = balance !== null ? breakIntoNotes(balance) : [];

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px", height: "48px", border: "4px solid #ea580c33",
            borderTop: "4px solid #ea580c", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
          }} />
          <p style={{ color: "#666", fontSize: "14px" }}>Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      padding: "24px 16px 48px",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* ── Balance Card ── */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 24px",
        background: "linear-gradient(135deg, #ea580c, #c2410c, #9a3412)",
        borderRadius: "20px",
        padding: "28px 24px",
        boxShadow: "0 12px 40px rgba(234,88,12,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Watermark */}
        <div style={{
          position: "absolute", right: "-20px", top: "-20px",
          fontSize: "120px", opacity: 0.08, fontWeight: 900, color: "#fff",
          userSelect: "none", pointerEvents: "none",
        }}>₹</div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                Rudhra Wallet
              </p>
              <p style={{ color: "#fff", fontSize: "15px", fontWeight: 700, margin: "4px 0 0", opacity: 0.9 }}>
                {userName || "—"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: "2px 0 0", fontFamily: "monospace" }}>
                {userId}
              </p>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "8px 12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <span style={{ fontSize: "22px" }}>🪙</span>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: "0 0 4px", fontWeight: 500 }}>
              Available Balance
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "24px", fontWeight: 300 }}>₹</span>
              <span style={{
                color: "#fff", fontSize: "52px", fontWeight: 800,
                lineHeight: 1, letterSpacing: "-2px",
              }}>
                {balance?.toLocaleString("en-IN") ?? "—"}
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", margin: "4px 0 0" }}>
              Rudhra Credits
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        maxWidth: "480px",
        margin: "0 auto 20px",
        display: "flex",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "4px",
        gap: "4px",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        {([
          { key: "notes", label: "💵 Notes" },
          { key: "send",  label: "📤 Send" },
          { key: "history", label: "📋 History" },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.2s ease",
              background: tab === key
                ? "linear-gradient(135deg, #ea580c, #c2410c)"
                : "transparent",
              color: tab === key ? "#fff" : "rgba(255,255,255,0.5)",
              boxShadow: tab === key ? "0 2px 12px rgba(234,88,12,0.4)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Notes Tab ── */}
      {tab === "notes" && (
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          {balance === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>💸</div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>No balance to display</p>
            </div>
          ) : (
            <div>
              <p style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
                textAlign: "center",
              }}>
                Your ₹{balance?.toLocaleString("en-IN")} in Rudhra Notes
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {notes.map(({ denom, count }) => (
                  <RudhraNote key={denom} denom={denom} count={count} />
                ))}
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── Send Tab ── */}
      {tab === "send" && (
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}>
            <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 20px" }}>
              Send Rudhra Credits
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>
                  RECIPIENT USER ID
                </label>
                <input
                  id="send-userid"
                  value={toUserId}
                  onChange={(e) => setToUserId(e.target.value)}
                  placeholder="e.g. ABCD1234"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>
                  RECIPIENT PHONE NUMBER
                </label>
                <input
                  id="send-phone"
                  value={toPhone}
                  onChange={(e) => setToPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>
                  AMOUNT (₹)
                </label>
                <input
                  id="send-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Minimum ₹10, multiples of 10"
                  min={10}
                  step={10}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {/* Quick amount buttons */}
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                  {[10, 50, 100, 200, 500].map((q) => (
                    <button
                      key={q}
                      onClick={() => setAmount(String(q))}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: amount === String(q) ? "rgba(234,88,12,0.5)" : "rgba(255,255,255,0.08)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      ₹{q}
                    </button>
                  ))}
                </div>
              </div>

              {sendMsg && (
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: sendMsg.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${sendMsg.type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                  color: sendMsg.type === "success" ? "#86efac" : "#fca5a5",
                  fontSize: "13px",
                  fontWeight: 500,
                }}>
                  {sendMsg.type === "success" ? "✅ " : "❌ "}{sendMsg.text}
                </div>
              )}

              <button
                id="send-submit"
                onClick={handleSend}
                disabled={sending}
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  background: sending ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #ea580c, #c2410c)",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: sending ? "not-allowed" : "pointer",
                  boxShadow: sending ? "none" : "0 4px 20px rgba(234,88,12,0.4)",
                  transition: "all 0.2s",
                }}
              >
                {sending ? "Sending..." : "Send ₹ Rudhra Credits →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {tab === "history" && (
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          {transactions.length === 0 ? (
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              padding: "40px 24px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {transactions.map((tx) => {
                const isCredit = tx.toUserId === userId;
                const isBonus  = tx.type === "signup_bonus";
                const isAdmin  = tx.type === "admin_credit";
                const label = isBonus ? "🎁 Signup Bonus"
                  : isAdmin ? "👑 Admin Credit"
                  : isCredit ? `📥 From ${tx.fromName}`
                  : `📤 To ${tx.toName}`;
                const amtColor = (isCredit || isBonus || isAdmin) ? "#86efac" : "#fca5a5";
                const amtSign  = (isCredit || isBonus || isAdmin) ? "+" : "-";

                return (
                  <div key={tx._id} style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backdropFilter: "blur(10px)",
                  }}>
                    <div>
                      <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px", margin: 0 }}>{label}</p>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "3px 0 0" }}>
                        {new Date(tx.createdAt).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                      {tx.note && (
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", margin: "2px 0 0", fontStyle: "italic" }}>
                          {tx.note}
                        </p>
                      )}
                    </div>
                    <div style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: amtColor,
                      letterSpacing: "-0.5px",
                    }}>
                      {amtSign}₹{tx.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(234,88,12,0.6) !important; box-shadow: 0 0 0 2px rgba(234,88,12,0.2); }
      `}</style>
    </div>
  );
}
