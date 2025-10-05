import dbConnect from "@/lib/dbconnect";
import l3User from "@/models/l3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      name,
      contactNo,
      peeta,
      karthruGuru,
      firebaseUid,
    } = await req.json();

    // Check if phone number already exists
    const existingUser = await l3User.findOne({ contactNo });
    if (existingUser) {
      return NextResponse.json(
        { message: "Phone number already registered" },
        { status: 400 }
      );
    }

    let userId;
    let isUnique = false;

    while (!isUnique) {
      userId = `${name.substring(0, 4).toUpperCase()}${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      const existingUserId = await l3User.findOne({ userId });
      if (!existingUserId) isUnique = true;
    }

    const newUser = new l3User({
      userId,
      name,
      contactNo,
      peeta,
      karthruGuru,
      firebaseUid,
      // Set defaults for other fields to avoid validation errors
      dob: null,
      gender: null,
      mailId: null,
      bhage: null,
      gothra: null,
      nationality: null,
      presentAddress: null,
      permanentAddress: null,
      qualification: null,
      higherDegree: null,
      occupation: null,
      languageKnown: null,
      selectedL2User: null,
      photoUrl: null,
      kula: null,
      married: null,
      maneDhevaruName: null,
      maneDhevaruAddress: null,
      subKula: null,
      guardianType: null,
      guardianName: null,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User signed up successfully!", userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ message: "Failed to sign up user." }, { status: 500 });
  }
}
