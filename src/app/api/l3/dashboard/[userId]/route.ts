// app/api/l1/dashboard/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect'; // Adjust path if needed
import l3User from '@/models/l3'; // Adjust path if needed

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    await dbConnect(); // Ensure DB connection

    const { userId } = params; // Get userId from params

    console.log("Received userId:", userId); // Debug log

    try {
        const user = await l3User.findOne({ userId }); // Find user by userId

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Exclude password from response
        const { password, ...userData } = user.toObject();
        console.log(password)
        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
