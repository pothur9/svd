import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l1cal from '@/models/l1cal';
// Handler for fetching events
export async function GET(req: NextRequest) {
    await dbConnect(); // Ensure DB connection

    try {
        const events = await l1cal.find({}); // Fetch all events
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { message: 'Error fetching events' },
            { status: 500 }
        );
    }
}

// Catch-all for unsupported HTTP methods
export async function handler(req: NextRequest) {
    return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
    );
}
