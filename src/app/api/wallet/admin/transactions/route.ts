import dbConnect from "@/lib/dbconnect";
import WalletTransaction from "@/models/walletTransaction";
import l2User from "@/models/l2";
import l3User from "@/models/l3";
import l4User from "@/models/l4";
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

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 50;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      WalletTransaction.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WalletTransaction.countDocuments({}),
    ]);

    // Aggregate total balance across all levels
    const [l2Total, l3Total, l4Total] = await Promise.all([
      l2User.aggregate([{ $group: { _id: null, sum: { $sum: "$walletBalance" } } }]),
      l3User.aggregate([{ $group: { _id: null, sum: { $sum: "$walletBalance" } } }]),
      l4User.aggregate([{ $group: { _id: null, sum: { $sum: "$walletBalance" } } }]),
    ]);

    const stats = {
      l2Total: l2Total[0]?.sum ?? 0,
      l3Total: l3Total[0]?.sum ?? 0,
      l4Total: l4Total[0]?.sum ?? 0,
      grandTotal: (l2Total[0]?.sum ?? 0) + (l3Total[0]?.sum ?? 0) + (l4Total[0]?.sum ?? 0),
      totalTransactions: total,
    };

    return NextResponse.json({ transactions, stats, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Admin transactions error:", error);
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
