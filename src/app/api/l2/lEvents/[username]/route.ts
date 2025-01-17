import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbconnect";
import l2cal from '@/models/l2cal';

// GET: Fetch events for a specific user (username)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract the username from the URL
    const url = new URL(request.url);
    let username = url.pathname.split('/').pop();  // Get the last part of the URL path

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Decode the encoded username
    username = decodeURIComponent(username.trim());

    // Log the decoded username to verify
    console.log('Decoded Username from URL:', username);

    // Fetch events for the given username
    const events = await l2cal.find({ userName: { $regex: new RegExp(`^${username}$`, 'i') } });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}
