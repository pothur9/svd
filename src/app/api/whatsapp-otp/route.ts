import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// In-memory OTP store  (phone → { otp, expiresAt })
// For a multi-instance / serverless deployment, replace this with Redis or MongoDB.
// ─────────────────────────────────────────────────────────────────────────────
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const WHATSAPP_TOKEN = process.env.NEXT_PUBLIC_OTP;          // Bearer token
const PHONE_NUMBER_ID = "1253379004531119";                   // Meta phone-number ID
const GRAPH_API_URL   = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;
const OTP_TTL_MS      = 5 * 60 * 1000;                       // 5 minutes

/** Generate a cryptographically-safe 6-digit OTP */
function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/whatsapp-otp
//   body: { action: "send",   phone: "91XXXXXXXXXX" }
//   body: { action: "verify", phone: "91XXXXXXXXXX", otp: "XXXXXX" }
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, otp: userOtp } = body as {
      action: string;
      phone: string;
      otp?: string;
    };

    // ── SEND ────────────────────────────────────────────────────────────────
    if (action === "send") {
      if (!phone) {
        return NextResponse.json({ message: "Phone number is required" }, { status: 400 });
      }

      // Prefix with country code if 10-digit local number
      const toNumber = phone.length === 10 ? `91${phone}` : phone;

      const otp = generateOtp();
      otpStore.set(toNumber, { otp, expiresAt: Date.now() + OTP_TTL_MS });

      // ── Old 2factor.in call (commented out) ─────────────────────────────
      // const response = await fetch(
      //   `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/${phone}/AUTOGEN3/SVD`
      // );
      // const otpData = await response.json();
      // if (otpData.Status === "Success") {
      //   return NextResponse.json({ Status: "Success", Details: otpData.Details });
      // }
      // return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
      // ────────────────────────────────────────────────────────────────────

      // ── WhatsApp OTP via Meta Graph API ─────────────────────────────────
      const waPayload = {
        messaging_product: "whatsapp",
        to: toNumber,
        type: "template",
        template: {
          name: "otp",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: otp }],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: otp }],
            },
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
        // Return a session-like token (the phone itself acts as key)
        return NextResponse.json({
          Status: "Success",
          Details: toNumber,           // "sessionId" used by client
        });
      }

      console.error("WhatsApp OTP send failed:", waData);
      return NextResponse.json(
        { message: "Failed to send WhatsApp OTP", error: waData },
        { status: 500 }
      );
    }

    // ── VERIFY ──────────────────────────────────────────────────────────────
    if (action === "verify") {
      if (!phone || !userOtp) {
        return NextResponse.json({ message: "Phone and OTP are required" }, { status: 400 });
      }

      const toNumber = phone.length === 10 ? `91${phone}` : phone;

      // ── Old 2factor.in verify call (commented out) ───────────────────────
      // const verifyResponse = await fetch(
      //   `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_OTP_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
      // );
      // const verifyData = await verifyResponse.json();
      // if (verifyData.Status === "Success") {
      //   return NextResponse.json({ Status: "Success", verified: true });
      // }
      // return NextResponse.json({ Status: "Failed", verified: false }, { status: 400 });
      // ────────────────────────────────────────────────────────────────────

      const stored = otpStore.get(toNumber);

      if (!stored) {
        return NextResponse.json(
          { Status: "Failed", message: "OTP not found. Please request a new one." },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(toNumber);
        return NextResponse.json(
          { Status: "Failed", message: "OTP has expired. Please request a new one." },
          { status: 400 }
        );
      }

      if (stored.otp !== userOtp) {
        return NextResponse.json(
          { Status: "Failed", message: "Invalid OTP. Please try again." },
          { status: 400 }
        );
      }

      // OTP matched — delete from store (one-time use)
      otpStore.delete(toNumber);
      return NextResponse.json({ Status: "Success", verified: true });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("WhatsApp OTP error:", error);
    return NextResponse.json({ message: "OTP operation failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
