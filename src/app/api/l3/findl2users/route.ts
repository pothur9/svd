import {  NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l2 from '@/models/l2';  // Assuming L2User model exists

// GET: Fetch all L2 users for the dropdown
export async function GET() {
  try {
    await dbConnect();

    const users = await l2.find({}, 'name');  // Only fetching name field

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching L2 users:', error);
    return NextResponse.json({ error: 'Error fetching L2 users' }, { status: 500 });
  }
}
