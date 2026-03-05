import dbConnect from "@/lib/dbconnect";
import l1User from "@/models/l1";
import l2User from "@/models/l2";
import l3User from "@/models/l3";
import l4User from "@/models/l4";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const { userId, contactNo } = await req.json();

        if (!userId || !contactNo) {
            return NextResponse.json(
                { message: "User ID and contact number are required." },
                { status: 400 }
            );
        }

        // Try deleting from each level — first match wins
        const levels = [
            { model: l1User, name: "L1" },
            { model: l2User, name: "L2" },
            { model: l3User, name: "L3" },
            { model: l4User, name: "L4" },
        ];

        for (const { model, name } of levels) {
            // Verify both userId AND contactNo match (prevents accidental deletions)
            const user = await (model as typeof l4User).findOne({ userId, contactNo });
            if (user) {
                await (model as typeof l4User).deleteOne({ userId });
                console.log(`[delete-account] Deleted ${name} user: ${userId}`);
                return NextResponse.json(
                    { message: "Your account has been successfully deleted." },
                    { status: 200 }
                );
            }
        }

        // No matching user found in any level
        return NextResponse.json(
            { message: "No account found with the provided User ID and contact number." },
            { status: 404 }
        );
    } catch (error) {
        console.error("[delete-account] Error:", error);
        return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 });
    }
}
