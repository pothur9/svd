
import dbConnect from "@/lib/dbconnect";
import admin from '@/models/admin'
import bcrypt from "bcryptjs"
import { NextRequest,NextResponse } from "next/server";

export  async function POST(req:NextRequest) {
  await dbConnect();

  if (req.method === 'POST') {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText); // Parsing the text as JSON

    const { name, phnumber, password } = body;

    if (!name || !phnumber || !password) {
        return NextResponse.json({ error: 'missing fealds!!' }, { status: 400 });
    }

    try {
      // Check if user with the phone number already exists
      const existingUser = await admin.findOne({ phnumber });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new admin({
        name,
        phnumber,
        password: hashedPassword,
      });

      await newUser.save();

      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
