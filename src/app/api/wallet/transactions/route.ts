import dbConnect from "@/lib/dbconnect";
import WalletTransaction from "@/models/walletTransaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    const transactions = await WalletTransaction.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Transactions fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch transactions" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
