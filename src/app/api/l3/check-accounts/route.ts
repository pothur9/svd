// app/api/l3/check-accounts/route.ts
import dbConnect from "@/lib/dbconnect";
import l3User from '@/models/l3';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { contactNo } = await req.json();

    if (!contactNo) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Find all accounts with this phone number
    const accounts = await l3User.find({ contactNo }, 'userId name');

    if (accounts.length === 0) {
      return NextResponse.json({ error: 'No accounts found with this phone number' }, { status: 404 });
    }

    return NextResponse.json({
      accounts: accounts.map(account => ({
        userId: account.userId,
        name: account.name
      }))
    }, { status: 200 });

  } catch (error) {
    console.error("Error checking accounts:", error);
    return NextResponse.json({ error: 'Failed to check accounts' }, { status: 500 });
  }
}
