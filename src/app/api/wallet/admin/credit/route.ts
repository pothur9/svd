import dbConnect from "@/lib/dbconnect";
import l2User from "@/models/l2";
import l3User from "@/models/l3";
import l4User from "@/models/l4";
import WalletTransaction from "@/models/walletTransaction";
import { NextRequest, NextResponse } from "next/server";

function verifyAdminToken(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const pass = process.env.ADMIN_WALLET_PASSWORD || "SVDAdmin@2024";
    return parts[0] === "admin" && parts[2] === pass;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { userId, phone, amount, note } = await req.json();

    if ((!userId && !phone) || !amount) {
      return NextResponse.json({ message: "userId or phone, and amount are required" }, { status: 400 });
    }

    const creditAmount = Number(amount);
    if (isNaN(creditAmount) || creditAmount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // Find user by userId or phone across all levels
    let user = null;
    let level = "";
    let Model: typeof l2User | typeof l3User | typeof l4User | null = null;

    const query = userId
      ? { userId }
      : { contactNo: phone };

    user = await l2User.findOne(query);
    if (user) { level = "l2"; Model = l2User; }

    if (!user) {
      user = await l3User.findOne(query);
      if (user) { level = "l3"; Model = l3User; }
    }

    if (!user) {
      user = await l4User.findOne(query);
      if (user) { level = "l4"; Model = l4User; }
    }

    if (!user || !Model) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await Model.findOneAndUpdate(
      { userId: user.userId },
      { $inc: { walletBalance: creditAmount } }
    );

    await WalletTransaction.create({
      fromUserId: "ADMIN",
      toUserId: user.userId,
      fromName: "Admin",
      toName: user.name,
      amount: creditAmount,
      type: "admin_credit",
      note: note || "Admin credited amount",
      userLevel: level,
    });

    return NextResponse.json({
      message: `₹${creditAmount} credited to ${user.name} (${user.userId})`,
      newBalance: (user.walletBalance ?? 0) + creditAmount,
    });
  } catch (error) {
    console.error("Admin credit error:", error);
    return NextResponse.json({ message: "Credit failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
