import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Ensure proper DB connection
import l1User from '@/models/l1'; // User model for l1
import l2User from '@/models/l2'; // User model for l2
import l3User from '@/models/l3'; // User model for l3

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    await dbConnect(); // Connect to the database

    const { userId } = params; // Extract userId from params

    try {
        // Fetch user details from l1 by userId
        const user = await l1User.findOne({ userId });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Get `username` from the fetched user
        const { username, peeta, ...userData } = user.toObject();

        // Compare with `l2` and fetch matching user count
        const l2UserCount = await l2User.countDocuments({ username });

        // Fetch the total number of users in l3
        const l3UserCount = await l3User.countDocuments();

        // Return response with all required data
        return NextResponse.json(
            {
                ...userData,
                username,
                peeta,
                l2UserCount,
                l3UserCount,
                totalUserCount: l2UserCount + l3UserCount,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
