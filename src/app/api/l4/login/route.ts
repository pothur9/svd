// pages/api/l4/login
import dbConnect from "@/lib/dbconnect";
import l4User from '@/models/l4';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await l4User.findOne({ userId });

    if (!user) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        name: user.name,
        contactNo: user.contactNo,
        peeta: user.peeta,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
