import dbConnect from "@/lib/dbconnect";
import l2User from "@/models/l2";
import l3User from "@/models/l3";
import l4User from "@/models/l4";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const level  = searchParams.get("level"); // l2 | l3 | l4

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    let user = null;
    if (level === "l2") {
      user = await l2User.findOne({ userId }).select("walletBalance name userId contactNo");
    } else if (level === "l3") {
      user = await l3User.findOne({ userId }).select("walletBalance name userId contactNo");
    } else if (level === "l4") {
      user = await l4User.findOne({ userId }).select("walletBalance name userId contactNo");
    } else {
      // search all levels
      user = await l2User.findOne({ userId }).select("walletBalance name userId contactNo");
      if (!user) user = await l3User.findOne({ userId }).select("walletBalance name userId contactNo");
      if (!user) user = await l4User.findOne({ userId }).select("walletBalance name userId contactNo");
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.userId,
      name: user.name,
      walletBalance: user.walletBalance ?? 0,
    });
  } catch (error) {
    console.error("Balance fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch balance" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
