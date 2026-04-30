import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_WALLET_PASSWORD || "SVDAdmin@2024";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ message: "Password required" }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    // Return a simple session token (timestamp-based, validated by ADMIN_PASSWORD env)
    const token = Buffer.from(`admin:${Date.now()}:${ADMIN_PASSWORD}`).toString("base64");

    return NextResponse.json({ 
      message: "Login successful", 
      token,
      adminName: "Sanathana VeeraShiva Trust Admin"
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
