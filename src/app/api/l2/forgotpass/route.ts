// app/api/l1/forgot-password/route.ts
import dbConnect from '@/lib/dbconnect';
import l2User from '@/models/l2';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

// POST request to verify userId and contact number
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { userId, contactNo, newPassword } = await req.json();

    if (!userId || !contactNo || !newPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const user = await l2User.findOne({ userId, contactNo });

    if (!user) {
      return NextResponse.json({ message: 'Invalid userId or contact number' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
