// app/api/userCounts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l1User from '@/models/l1'; // Adjust path if needed
import l2User from '@/models/l2'; // Adjust path if needed
import l3User from '@/models/l3'; // Adjust path if needed
import l4User from '@/models/l4'; // Adjust path if needed
export const dynamic = "force-dynamic";

// Static daily growth offset — adds ~50-60 users per day to the displayed total
// Change BASE_DATE to control when counting started, and DAILY_GROWTH to adjust speed
const BASE_DATE = new Date('2024-01-01T00:00:00Z');
const DAILY_GROWTH = 55; // average users added per day (50-60 range)

function getDailyOffset(): number {
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceBase = Math.floor((now.getTime() - BASE_DATE.getTime()) / msPerDay);
    return daysSinceBase * DAILY_GROWTH;
}

export async function GET() {
    await dbConnect(); // Ensure DB connection

    try {
        // Fetch user counts from each collection
        const l1Count = await l1User.countDocuments({});
        const l2Count = await l2User.countDocuments({});
        const l3Count = await l3User.countDocuments({});
        const l4Count = await l4User.countDocuments({});

        // Real DB count + static daily offset for display
        const realCount = l1Count + l2Count + l3Count + l4Count;
        const totalUsers = realCount + getDailyOffset();

        return NextResponse.json({ totalUsers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user counts:", error);
        return NextResponse.json({ message: 'Failed to fetch user counts' }, { status: 500 });
    }
}
