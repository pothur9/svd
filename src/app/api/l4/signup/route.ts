import dbConnect from "@/lib/dbconnect";
import l4User from "@/models/l4";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req:NextRequest) {
  try {
    await dbConnect();

    const {
      name,
      dob,
      gender,
      contactNo,
      mailId,
      karthruGuru,
      peeta,
      bhage,
      gothra,
      nationality,
      presentAddress,
      permanentAddress,
      qualification,
      occupation,
      languageKnown,
      password,
      selectedL2User,
      photoUrl, 
      fcmToken,
    } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

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
      dob,
      gender,
      contactNo,
      mailId,
      karthruGuru,
      peeta,
      bhage,
      gothra,
      nationality,
      presentAddress,
      permanentAddress,
      qualification,
      occupation,
      languageKnown,
      selectedL2User,
      password: hashedPassword,
      photoUrl, 
      fcmToken,
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
