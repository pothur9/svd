// pages/api/l1/login.js
import dbConnect from "@/lib/dbconnect"; // Adjust the path as necessary
import l3User from '@/models/l3'; // Ensure you have the correct model imported
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure that the database connection is established

  try {
    const { userId, password } = await req.json(); // Parse the request body as JSON

    const user = await l3User.findOne({ userId }); // Fetch user from database

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Login successful
    return NextResponse.json({ message: 'Login successful' }, { status: 200 }); // Changed to 200 for successful login
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
