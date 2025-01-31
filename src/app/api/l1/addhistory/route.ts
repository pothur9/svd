import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l1history from '@/models/l1history';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { username, history, gurusTimeline, specialDevelopments, institutes } = body;

    // Validate input
    if (!username) {
      return NextResponse.json({ message: 'Username is required.' }, { status: 400 });
    }

    // Generate a unique userId if not present
    const userId = `${username}-${Math.floor(Math.random() * 10000)}`;

    // Log the generated userId for debugging
    console.log('Generated userId:', userId);

    // Check if user history already exists
    const existingUser = await l1history.findOne({ username });

    if (existingUser) {
      return NextResponse.json({ message: 'History already present for this user.' }, { status: 409 });
    }

    // Create new entry if username not found
    const newUserData = new l1history({
      username,
      userId, // Generated userId
      history,
      gurusTimeline,
      specialDevelopments,
      institutes,
    });

    await newUserData.save();

    return NextResponse.json({ message: 'Data saved successfully.' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error saving data:', error);

    // Safely handle the error
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Server error', error: 'Unknown error' }, { status: 500 });
    }
  }
}
