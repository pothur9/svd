import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbconnect";
import L2User from "@/models/l2";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectMongoDB();
    const userId = (params.userId || '').trim();
    const data = await request.json();

    // Build case-insensitive exact-match regex for userId
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idRegex = new RegExp(`^${escapeRegex(userId)}$`, 'i');

    // Prepare update payload (only set provided fields)
    const payload: Record<string, unknown> = {};
    const fields = [
      'name',
      'contactNo',
      'dob',
      'address',
      'dhekshaGuru',
      'karthruGuru',
      'gender',
      'bhage',
      'gothra',
      'mariPresent',
      'paramapare',
      'parampare',
      'imageUrl',
      'peetarohanaDate',
    ];
    for (const f of fields) {
      if (typeof data[f] !== 'undefined' && data[f] !== null && data[f] !== '') {
        payload[f] = data[f];
      }
    }

    // Update user data (case-insensitive userId)
    const updatedUser = await L2User.findOneAndUpdate(
      { userId: idRegex },
      { $set: payload },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}