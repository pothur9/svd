import dbConnect from "@/lib/dbconnect";
import admin from '@/models/admin';
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    await dbConnect(); // Make sure the database is connected

    if (req.method === 'POST') {
        try {
            const body = await req.json(); // Parsing the JSON body of the request
            const { phnumber, password } = body;

            if (!phnumber || !password) {
                return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
            }

            // Find the user by phone number
            const user = await admin.findOne({ phnumber });
            if (!user) {
                return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
            }

            // Compare the hashed passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
            }

            // Assuming you handle session or token creation here

            // Sending a success response
            return new Response(JSON.stringify({ message: 'Login successful', user: { name: user.name, phnumber: user.phnumber } }), { status: 200 });

        } catch (error) {
            return new Response(JSON.stringify({ error: 'Server error', details: error }), { status: 500 });
        }
    } else {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
}
