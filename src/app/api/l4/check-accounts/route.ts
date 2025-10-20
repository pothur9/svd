import dbConnect from "@/lib/dbconnect";
import l4User from '@/models/l4';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { contactNo } = await req.json();

    if (!contactNo) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const accounts = await l4User.find({ contactNo }, 'userId name');

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
    console.error("L4 check-accounts error:", error);
    return NextResponse.json({ error: 'Failed to check accounts' }, { status: 500 });
  }
}
