import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/dbconnect";
import l2cal from '@/models/l2cal';

// GET: Fetch events for a specific guru
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract and decode guruName from the URL path
    const url = new URL(request.url);
    let guruName = url.pathname.split('/').pop(); // Get the last part of the URL path

    if (!guruName) {
      return NextResponse.json({ error: 'Guru name is required' }, { status: 400 });
    }

    // Decode the encoded guruName
    guruName = decodeURIComponent(guruName.trim());
    console.log('Decoded Guru name from URL:', guruName);

    // Use case-insensitive matching for userName
    const events = await l2cal.find({ userName: { $regex: new RegExp(`^${guruName}$`, 'i') } });
    console.log('Fetched events:', events);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
  }
}
