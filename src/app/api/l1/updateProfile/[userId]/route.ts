import { NextResponse } from 'next/server';
import  connectToDatabase  from '@/lib/dbconnect';
import L1User from '@/models/l1';

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const data = await request.json();

    // Only allow updates to specific fields
    const updateData = {
      name: data.name,
      dob: data.dob,
      peeta: data.peeta,
      dhekshaGuru: data.dhekshaGuru,
    };

    const updatedUser = await L1User.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}