// app/api/l2/signup/route.ts
import dbConnect from "@/lib/dbconnect";
import l2User from '@/models/l2'; // Assuming l2 user model is available
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

async function generateUniqueUserId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let userId;
    let isUnique = false;

    while (!isUnique) {
        const lettersPart = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        const numbersPart = Array.from({ length: 4 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
        
        userId = `${lettersPart}${numbersPart}`;
        const existingUser = await l2User.findOne({ userId });
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
            parampare,  // Add this line
            name,
            dob,
            contactNo,
            peetarohanaDate,
            gender,
            karthruGuru, // Selected name from dropdown
            dhekshaGuru,
            peeta,
            bhage,
            gothra,
            mariPresent,
            password,
            imageUrl,
            address,
           
            
        } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await generateUniqueUserId();

        const newUser = new l2User({
            parampare,  // Add this line
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
            password: hashedPassword,
            imageUrl,
            address,
          
        });

        await newUser.save();
        
        return NextResponse.json({ message: 'User signed up successfully!', userId }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: 'Failed to sign up user.' }, { status: 500 });
    }
}
