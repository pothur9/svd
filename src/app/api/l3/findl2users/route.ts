import {  NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l2 from '@/models/l2';  // Assuming L2User model exists

// Ensure this route never gets statically cached
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET: Fetch all L2 users for the dropdown
export async function GET() {
  try {
    await dbConnect();

    const users = await l2.find({}, 'name');  // Only fetching name field

    return NextResponse.json(users, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error('Error fetching L2 users:', error);
    return NextResponse.json({ error: 'Error fetching L2 users' }, {
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  }
}
