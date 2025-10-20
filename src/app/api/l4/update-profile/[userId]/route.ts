import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import l4User from "@/models/l4";

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const { userId } = params;
    const update = await req.json();

    const user = await l4User.findOneAndUpdate({ userId }, update, { new: true });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const { password, ...userData } = user.toObject();
    return NextResponse.json({ message: "Profile updated", user: userData }, { status: 200 });
  } catch (e) {
    console.error("L4 update-profile error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
