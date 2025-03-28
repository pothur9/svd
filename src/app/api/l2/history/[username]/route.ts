// app/api/l1/dashboard/[userId].ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l2history from '@/models/l2history'; // Import the model safely

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    await dbConnect(); // Ensure DB connection

    let { username } = params; // Get userId from params
    username = username.replace(/\s+/g, ''); // Remove all spaces from the username
    console.log("Fetching data for userId:", username); // Debug log

    try {
        const user = await l2history.findOne({ username }); // Find user by username

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user.toObject(), { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
