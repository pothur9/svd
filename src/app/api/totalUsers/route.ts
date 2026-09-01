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
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // IST offset (UTC+5:30)
const USERS_PER_30_MIN = 8; // Adds 8 users per active 30-minute interval

function get30MinOffset(): number {
    const now = new Date();

    // Convert both base date and current date to IST representation
    const baseIST = new Date(BASE_DATE.getTime() + IST_OFFSET_MS);
    const nowIST = new Date(now.getTime() + IST_OFFSET_MS);

    // Calculate full days between base midnight and current midnight
    const msPerDay = 24 * 60 * 60 * 1000;
    const baseMidnight = Date.UTC(baseIST.getUTCFullYear(), baseIST.getUTCMonth(), baseIST.getUTCDate());
    const nowMidnight = Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
    const fullDays = Math.max(0, Math.floor((nowMidnight - baseMidnight) / msPerDay));

    // Calculate active 30-min intervals for today (only between 8:00 AM and 10:00 PM IST)
    const hour = nowIST.getUTCHours();
    const minute = nowIST.getUTCMinutes();

    let todayActiveSlots = 0;
    if (hour >= 22) {
        todayActiveSlots = 28; // 14 active hours * 2 intervals = 28 max intervals per day
    } else if (hour >= 8) {
        const activeMinutes = (hour - 8) * 60 + minute;
        todayActiveSlots = Math.floor(activeMinutes / 30);
    } else {
        todayActiveSlots = 0; // Before 8:00 AM (overnight)
    }

    const totalActiveSlots = (fullDays * 28) + todayActiveSlots;
    return totalActiveSlots * USERS_PER_30_MIN;
}

export async function GET() {
    await dbConnect(); // Ensure DB connection

    try {
        // Fetch user counts from each collection
        const l1Count = await l1User.countDocuments({});
        const l2Count = await l2User.countDocuments({});
        const l3Count = await l3User.countDocuments({});
        const l4Count = await l4User.countDocuments({});

        // Real DB count + 30-minute active growth offset for display
        const realCount = l1Count + l2Count + l3Count + l4Count;
        const totalUsers = realCount + get30MinOffset();

        return NextResponse.json({ totalUsers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user counts:", error);
        return NextResponse.json({ message: 'Failed to fetch user counts' }, { status: 500 });
    }
}
