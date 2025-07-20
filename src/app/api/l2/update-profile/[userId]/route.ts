import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/dbconnect";
import L2User from "@/models/l2";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectMongoDB();
    const userId = params.userId;
    const data = await request.json();

    // Update user data
    const updatedUser = await L2User.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          name: data.name,
          contactNo: data.contactNo,
          dob: data.dob,
          address: data.address,
          dhekshaGuru: data.dhekshaGuru,
          // Don't update peeta as it should be managed by admin
          // imageUrl will be handled separately
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}