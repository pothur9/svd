import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbconnect";
import l1cal from '@/models/l1cal';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { date, title, description, username } = await request.json();

    if (!date || !title || !description || !username) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create a new event document
    const newEvent = new l1cal({
      date,
      title,
      description,
      username,
    });

    // Save the event to the database
    await newEvent.save();

    return NextResponse.json({ message: 'Event added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ error: 'Error adding event' }, { status: 500 });
  }
}
