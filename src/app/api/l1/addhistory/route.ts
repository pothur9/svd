// app/api/l1/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Ensure this points to your database connection file
import l1history from '@/models/l1history'; // Adjust path if needed

export async function POST(req: NextRequest) {
    await dbConnect(); // Ensure DB connection

    try {
        const body = await req.json();
        const { username, history, gurusTimeline, specialDevelopments, institutes } = body;

        // Create a new user data entry
        const newUserData = new l1history({
            username,
            history,
            gurusTimeline,
            specialDevelopments,
            institutes
        });

        await newUserData.save();

        return NextResponse.json({ message: 'Data saved successfully' }, { status: 201 });
    } catch (error) {
        console.error("Error saving data:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
