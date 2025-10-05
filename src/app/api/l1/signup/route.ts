import dbConnect from "@/lib/dbconnect";
import l1User from '@/models/l1';
import { NextRequest, NextResponse } from "next/server";

// Helper function to generate unique user ID
async function generateUniqueUserId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let userId;
    let isUnique = false;

    while (!isUnique) {
        const lettersPart = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        const numbersPart = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
        
        userId = `${lettersPart}${numbersPart}`;
        const existingUser = await l1User.findOne({ userId });
        if (!existingUser) {
            isUnique = true;
        }
    }
    return userId;
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const {
            name,
            dob,
            contactNo,
            peetarohanaDate,
            gender,
            karthruGuru,
            dhekshaGuru,
            peeta,
            bhage,
            gothra,
            mariPresent,
            firebaseUid,
            imageUrl, 
            address,// receiving image URL
        } = await req.json();

        const userId = await generateUniqueUserId();

        const newUser = new l1User({
            userId,
            name,
            dob,
            contactNo,
            peetarohanaDate,
            gender,
            karthruGuru,
            dhekshaGuru,
            peeta,
            bhage,
            gothra,
            mariPresent,
            firebaseUid,
            imageUrl, 
            address// storing image URL in the database
        });

        await newUser.save();
        
        return NextResponse.json({ message: 'User signed up successfully!', userId }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: 'Failed to sign up user.' }, { status: 500 });
    }
}
