import { NextRequest, NextResponse } from "next/server";

const ADMIN_PHONE = process.env.ADMIN_WALLET_OTP_PHONE || "7892343128";
// OTP_API_KEY is the old 2factor.in key — kept for reference
// const OTP_API_KEY = process.env.NEXT_PUBLIC_OTP_API_KEY || "3e5558da-7432-11ef-8b17-0200cd936042";

const WHATSAPP_TOKEN   = process.env.NEXT_PUBLIC_OTP;
const PHONE_NUMBER_ID  = "1253379004531119";
const GRAPH_API_URL    = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;
const OTP_TTL_MS       = 5 * 60 * 1000; // 5 minutes

// In-memory OTP store for admin phone
const adminOtpStore = new Map<string, { otp: string; expiresAt: number }>();

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  try {
    const { action, otp } = await req.json();
    const toNumber = ADMIN_PHONE.length === 10 ? `91${ADMIN_PHONE}` : ADMIN_PHONE;

    if (action === "send") {
      // ── Old 2factor.in send OTP (commented out) ──────────────────────────
      // const response = await axios.get(
      //   `https://2factor.in/API/V1/${OTP_API_KEY}/SMS/${ADMIN_PHONE}/AUTOGEN3/SVDAdmin`
      // );
      // if (response.data.Status === "Success") {
      //   return NextResponse.json({ message: "OTP sent successfully", sessionId: response.data.Details });
      // }
      // ────────────────────────────────────────────────────────────────────

      // ── WhatsApp OTP via Meta Graph API ──────────────────────────────────
      const generatedOtp = generateOtp();
      adminOtpStore.set(toNumber, { otp: generatedOtp, expiresAt: Date.now() + OTP_TTL_MS });

      const waPayload = {
        messaging_product: "whatsapp",
        to: toNumber,
        type: "template",
        template: {
          name: "otp",
          language: { code: "en" },
          components: [
            { type: "body", parameters: [{ type: "text", text: generatedOtp }] },
            { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: generatedOtp }] },
          ],
        },
      };

      const waResponse = await fetch(GRAPH_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(waPayload),
      });
      const waData = await waResponse.json();

      if (waResponse.ok && waData.messages?.[0]?.id) {
        return NextResponse.json({
          message: "OTP sent successfully via WhatsApp",
          sessionId: toNumber,
        });
      }
      console.error("WhatsApp OTP send failed:", waData);
      return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
    }

    if (action === "verify") {
      if (!otp) {
        return NextResponse.json({ message: "otp required" }, { status: 400 });
      }

      // ── Old 2factor.in verify OTP (commented out) ─────────────────────────
      // const response = await axios.get(
      //   `https://2factor.in/API/V1/${OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      // );
      // if (response.data.Status === "Success" || otp === "1234") { ... }
      // ────────────────────────────────────────────────────────────────────

      // ── WhatsApp OTP verify ──────────────────────────────────────────────
      const stored = adminOtpStore.get(toNumber);
      if (!stored) {
        return NextResponse.json({ message: "OTP not found. Please request a new one.", verified: false }, { status: 400 });
      }
      if (Date.now() > stored.expiresAt) {
        adminOtpStore.delete(toNumber);
        return NextResponse.json({ message: "OTP has expired.", verified: false }, { status: 400 });
      }
      if (stored.otp !== otp) {
        return NextResponse.json({ message: "Invalid OTP", verified: false }, { status: 400 });
      }
      adminOtpStore.delete(toNumber);
      return NextResponse.json({ message: "OTP verified", verified: true });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin OTP error:", error);
    return NextResponse.json({ message: "OTP operation failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
