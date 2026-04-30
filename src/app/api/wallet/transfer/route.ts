import dbConnect from "@/lib/dbconnect";
import l2User from "@/models/l2";
import l3User from "@/models/l3";
import l4User from "@/models/l4";
import WalletTransaction from "@/models/walletTransaction";
import { NextRequest, NextResponse } from "next/server";

// Helper: find user across all levels by userId AND contactNo (both must match)
async function findUserByIdAndPhone(userId: string, contactNo: string) {
  let user = null;
  let level = "";

  user = await l2User.findOne({ userId, contactNo });
  if (user) { level = "l2"; return { user, level }; }

  user = await l3User.findOne({ userId, contactNo });
  if (user) { level = "l3"; return { user, level }; }

  user = await l4User.findOne({ userId, contactNo });
  if (user) { level = "l4"; return { user, level }; }

  return { user: null, level: "" };
}

// Helper: find sender across all levels
async function findSender(userId: string) {
  let user = null;
  let level = "";
  let Model: typeof l2User | typeof l3User | typeof l4User | null = null;

  user = await l2User.findOne({ userId });
  if (user) { level = "l2"; Model = l2User; return { user, level, Model }; }

  user = await l3User.findOne({ userId });
  if (user) { level = "l3"; Model = l3User; return { user, level, Model }; }

  user = await l4User.findOne({ userId });
  if (user) { level = "l4"; Model = l4User; return { user, level, Model }; }

  return { user: null, level: "", Model: null };
}

// Helper: get level model
function getLevelModel(level: string) {
  if (level === "l2") return l2User;
  if (level === "l3") return l3User;
  if (level === "l4") return l4User;
  return null;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { fromUserId, toPhone, toUserId, amount } = await req.json();

    if (!fromUserId || !toPhone || !toUserId || !amount) {
      return NextResponse.json(
        { message: "fromUserId, toPhone, toUserId, and amount are required" },
        { status: 400 }
      );
    }

    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }
    if (transferAmount % 10 !== 0) {
      return NextResponse.json({ message: "Amount must be in multiples of ₹10" }, { status: 400 });
    }

    // Find sender
    const { user: sender, level: senderLevel, Model: SenderModel } = await findSender(fromUserId);
    if (!sender || !SenderModel) {
      return NextResponse.json({ message: "Sender not found" }, { status: 404 });
    }

    // Check balance
    const senderBalance = sender.walletBalance ?? 0;
    if (senderBalance < transferAmount) {
      return NextResponse.json(
        { message: `Insufficient balance. You have ₹${senderBalance}` },
        { status: 400 }
      );
    }

    // Prevent self-transfer
    if (fromUserId === toUserId) {
      return NextResponse.json({ message: "Cannot transfer to yourself" }, { status: 400 });
    }

    // Find recipient — must match BOTH userId AND phone
    const { user: recipient, level: recipientLevel } = await findUserByIdAndPhone(toUserId, toPhone);
    if (!recipient) {
      return NextResponse.json(
        { message: "Recipient not found. Please check the User ID and phone number." },
        { status: 404 }
      );
    }

    const RecipientModel = getLevelModel(recipientLevel);
    if (!RecipientModel) {
      return NextResponse.json({ message: "Recipient level error" }, { status: 500 });
    }

    // Execute transfer atomically
    await SenderModel.findOneAndUpdate(
      { userId: fromUserId },
      { $inc: { walletBalance: -transferAmount } }
    );
    await RecipientModel.findOneAndUpdate(
      { userId: toUserId },
      { $inc: { walletBalance: transferAmount } }
    );

    // Record transaction
    await WalletTransaction.create({
      fromUserId,
      toUserId,
      fromName: sender.name,
      toName: recipient.name,
      amount: transferAmount,
      type: "transfer",
      note: `Transfer from ${sender.name} to ${recipient.name}`,
      userLevel: recipientLevel,
    });

    return NextResponse.json({
      message: `₹${transferAmount} transferred successfully to ${recipient.name}`,
      newBalance: senderBalance - transferAmount,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json({ message: "Transfer failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
