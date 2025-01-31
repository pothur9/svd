import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'
import l2cal from '@/models/l2cal';

// POST: Add a new event
export async function POST(request: NextRequest) {
  try {
    await dbConnect(); // Connect to MongoDB

    const { date, title, description, username } = await request.json();

    // Validate required fields
    if (!date || !title || !description || !username) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create a new event
    const newEvent = new l2cal({
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
