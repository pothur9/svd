import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Ensure this points to your database connection file
import l1history from '@/models/l1history'; // Adjust path if needed

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure DB connection

  try {
    const body = await req.json();
    const { username, history, gurusTimeline, specialDevelopments, institutes } = body;

    // Validate that username exists
    if (!username) {
      return NextResponse.json({ message: 'Username is required.' }, { status: 400 });
    }

    // Check for duplicate entries by username
    const existingUser = await l1history.findOne({ username});
    if (existingUser) {
      return NextResponse.json({ message: 'User data already exists' }, { status: 409 }); // Conflict error
    }

    // Create a new user data entry
    const newUserData = new l1history({
      username,
      history,
      gurusTimeline,
      specialDevelopments,
      institutes
    });

    await newUserData.save();

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
