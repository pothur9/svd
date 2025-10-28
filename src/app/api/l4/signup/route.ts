import dbConnect from "@/lib/dbconnect";
import l4User from "@/models/l4";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  try {
    await dbConnect();

    const {
      name,
      contactNo,
      peeta,
      karthruGuru,
      firebaseUid,
    } = await req.json();

    const existingCount = await l4User.countDocuments({ contactNo });
    if (existingCount >= 12) {
      return NextResponse.json(
        { error: "This phone number already has 12 accounts. Please use a different number." },
        { status: 400 }
      );
    }

    let userId;
    let isUnique = false;

    while (!isUnique) {
      userId = `${name.substring(0, 4).toUpperCase()}${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      const existingUser = await l4User.findOne({ userId });
      if (!existingUser) isUnique = true; // Check if userId is unique
    }

    const newUser = new l4User({
      userId,
      name,
      contactNo,
      peeta,
      karthruGuru,
      firebaseUid,
      // rest left empty for complete-profile
      dob: null,
      gender: null,
      mailId: null,
      bhage: null,
      gothra: null,
      nationality: null,
      presentAddress: null,
      permanentAddress: null,
      qualification: null,
      occupation: null,
      languageKnown: null,
      selectedL2User: null,
      photoUrl: null,
      // newly added optional fields
      kula: null,
      married: null,
      higherDegree: null,
      maneDhevaruName: null,
      maneDhevaruAddress: null,
      subKula: null,
      guardianType: null,
      guardianName: null,
      sonOf: null,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User signed up successfully!", userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to sign up user." }, { status: 500 });
  }
}
