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
    const { amount, note, targetLevel } = await req.json();

    const creditAmount = Number(amount);
    if (isNaN(creditAmount) || creditAmount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    const levelChoice = targetLevel || "all";
    const transactionsToInsert: Array<{
      fromUserId: string;
      toUserId: string;
      fromName: string;
      toName?: string;
      amount: number;
      type: string;
      note: string;
      userLevel: string;
    }> = [];

    let totalUsersCount = 0;

    // Process L2 Users
    if (levelChoice === "all" || levelChoice === "l2") {
      const l2Users = await l2User.find({}, { userId: 1, name: 1 }).lean();
      if (l2Users.length > 0) {
        await l2User.updateMany({}, { $inc: { walletBalance: creditAmount } });
        l2Users.forEach((u) => {
          transactionsToInsert.push({
            fromUserId: "ADMIN",
            toUserId: u.userId,
            fromName: "Sanathana Veerashaiva Ligayatha Trust",
            toName: u.name || "L2 User",
            amount: creditAmount,
            type: "admin_credit",
            note: note || "Bulk credit to all users from Sanathana Veerashaiva Ligayatha Trust",
            userLevel: "l2",
          });
        });
        totalUsersCount += l2Users.length;
      }
    }

    // Process L3 Users
    if (levelChoice === "all" || levelChoice === "l3") {
      const l3Users = await l3User.find({}, { userId: 1, name: 1 }).lean();
      if (l3Users.length > 0) {
        await l3User.updateMany({}, { $inc: { walletBalance: creditAmount } });
        l3Users.forEach((u) => {
          transactionsToInsert.push({
            fromUserId: "ADMIN",
            toUserId: u.userId,
            fromName: "Sanathana Veerashaiva Ligayatha Trust",
            toName: u.name || "L3 User",
            amount: creditAmount,
            type: "admin_credit",
            note: note || "Bulk credit to all users from Sanathana Veerashaiva Ligayatha Trust",
            userLevel: "l3",
          });
        });
        totalUsersCount += l3Users.length;
      }
    }

    // Process L4 Users
    if (levelChoice === "all" || levelChoice === "l4") {
      const l4Users = await l4User.find({}, { userId: 1, name: 1 }).lean();
      if (l4Users.length > 0) {
        await l4User.updateMany({}, { $inc: { walletBalance: creditAmount } });
        l4Users.forEach((u) => {
          transactionsToInsert.push({
            fromUserId: "ADMIN",
            toUserId: u.userId,
            fromName: "Sanathana Veerashaiva Ligayatha Trust",
            toName: u.name || "L4 User",
            amount: creditAmount,
            type: "admin_credit",
            note: note || "Bulk credit to all users from Sanathana Veerashaiva Ligayatha Trust",
            userLevel: "l4",
          });
        });
        totalUsersCount += l4Users.length;
      }
    }

    if (transactionsToInsert.length > 0) {
      await WalletTransaction.insertMany(transactionsToInsert);
    }

    const totalDistributed = creditAmount * totalUsersCount;

    return NextResponse.json({
      message: `Successfully credited ₹${creditAmount} to ${totalUsersCount} user(s)! Total distributed: ₹${totalDistributed.toLocaleString("en-IN")}`,
      totalUsersCount,
      totalDistributed,
    });
  } catch (error) {
    console.error("Bulk credit error:", error);
    return NextResponse.json({ message: "Bulk credit failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
