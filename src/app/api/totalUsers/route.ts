// app/api/userCounts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l1User from '@/models/l1'; // Adjust path if needed
import l2User from '@/models/l2'; // Adjust path if needed
import l3User from '@/models/l3'; // Adjust path if needed
import l4User from '@/models/l4'; // Adjust path if needed
export const dynamic = "force-dynamic";

// Base date from which growth offset starts accumulating
const BASE_DATE = new Date('2024-01-01T00:00:00Z');
const MS_PER_30_MIN = 1000 * 60 * 30; // 30 minutes in milliseconds
const USERS_PER_30_MIN = 8; // Adds 8 users every 30 minutes (16 users per hour)

function get30MinOffset(): number {
    const now = new Date();
    const intervalsSinceBase = Math.floor((now.getTime() - BASE_DATE.getTime()) / MS_PER_30_MIN);
    if (intervalsSinceBase <= 0) return 0;
    return intervalsSinceBase * USERS_PER_30_MIN;
}

export async function GET() {
    await dbConnect(); // Ensure DB connection

    try {
        // Fetch user counts from each collection
        const l1Count = await l1User.countDocuments({});
        const l2Count = await l2User.countDocuments({});
        const l3Count = await l3User.countDocuments({});
        const l4Count = await l4User.countDocuments({});

        // Real DB count + 30-minute growth offset for display
        const realCount = l1Count + l2Count + l3Count + l4Count;
        const totalUsers = realCount + get30MinOffset();

        return NextResponse.json(
            { totalUsers },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching user counts:", error);
        return NextResponse.json({ message: 'Failed to fetch user counts' }, { status: 500 });
    }
}
