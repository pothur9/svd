// app/api/l1/dashboard/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l2User from '@/models/l2'; // Adjust path if needed

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    await dbConnect(); // Ensure DB connection

    const { userId } = params; // Get userId from params
    const trimmed = (userId || '').trim();
    console.log("L2 Dashboard API - Received userId:", userId, "trimmed:", trimmed); // Debug log

    // Build case-insensitive exact-match regex for userId
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const idRegex = new RegExp(`^${escapeRegex(trimmed)}$`, 'i');

    try {
        // Find user by case-insensitive, trimmed userId
        const user = await l2User.findOne({ userId: idRegex });

        if (!user) {
            console.warn("L2 Dashboard API - User not found for userId:", userId);
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Exclude password from response
        const userData: Record<string, unknown> = user.toObject();
        delete userData.password;
        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
