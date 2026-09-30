// app/api/userCounts/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l1User from '@/models/l1'; // Adjust path if needed
import l2User from '@/models/l2'; // Adjust path if needed
import l3User from '@/models/l3'; // Adjust path if needed
import l4User from '@/models/l4'; // Adjust path if needed
export const dynamic = "force-dynamic";

// Count frozen at 2026-09-30 22:35 IST — no more auto-increment
// Calculated: BASE_OFFSET(106) + (812 active slots × 4 users/slot) = 3354
const FROZEN_OFFSET = 3354;

function get30MinOffset(): number {
    return FROZEN_OFFSET;
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
