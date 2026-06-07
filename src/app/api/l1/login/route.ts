// api/l1/login
import dbConnect from "@/lib/dbconnect";
import l1User from '@/models/l1';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { userId, contactNo } = await req.json();

    if (!userId || !contactNo) {
      return NextResponse.json({ message: 'userId and contactNo are required' }, { status: 400 });
    }

    // Find user by userId and verify contactNo matches
    const user = await l1User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.contactNo !== contactNo) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // OTP was already verified client-side — login successful
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
