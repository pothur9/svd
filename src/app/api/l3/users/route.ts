// app/api/l1/getNames/route.ts
import dbConnect from "@/lib/dbconnect";
import l2User from '@/models/l2'; // Assuming l1 user model is available
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    try {
        const users = await l2User.find({}, 'name');
        return NextResponse.json(users.map(user => user.name), { status: 200 });
    } catch (error) {
        console.error("Error fetching l1 user names:", error);
        return NextResponse.json({ error: 'Failed to fetch l1 user names.' }, { status: 500 });
    }
}