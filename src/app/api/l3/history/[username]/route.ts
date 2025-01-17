// app/api/l1/dashboard/[userId].ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l2history from '@/models/l2history'; // Import the model safely

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    await dbConnect(); // Ensure DB connection

    const { username } = params; // Get userId from params

    console.log("Fetching data for username:", username); // Debug log

    try {
        const user = await l2history.findOne({ username }); // Find user by userId

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user.toObject(), { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
