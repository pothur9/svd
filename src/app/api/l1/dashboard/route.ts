import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l1User from '@/models/l1';
import l2User from '@/models/l2';
import l3User from '@/models/l3';
import l4User from '@/models/l4'; // Assuming there's an L4 model


interface L2User {
    name: string;
    peeta: string;
    // Add other fields based on your model
}

interface L3User {
    name: string;
    selectedL2User: string;
    // Add other fields based on your model
}

interface L4User {
    name: string;
    selectedL2User: string;
    // Add other fields based on your model
}

export async function GET() {
    await dbConnect();

    try {
        // Fetch all L1, L2, L3, and L4 users
        const l1Users = await l1User.find().lean();
        const l2Users = (await l2User.find().lean()) as unknown as L2User[]; // Cast to unknown first, then L2User[]
        const l3Users = (await l3User.find().lean()) as unknown as L3User[]; // Cast to unknown first, then L3User[]
        const l4Users = (await l4User.find().lean()) as unknown as L4User[]; // Cast to unknown first, then L4User[]

      

        // Group L2 users by their peeta (L1 user name)
        const groupedL2Users = l2Users.reduce((acc, user: L2User) => {
            const { peeta } = user;
            if (peeta) {
                if (!acc[peeta]) acc[peeta] = [];
                acc[peeta].push(user);
            }
            return acc;
        }, {} as Record<string, L2User[]>);

        // Group L3 users by their selectedL2User (L2 user's name)
        const groupedL3Users = l3Users.reduce((acc, user: L3User) => {
            const { selectedL2User } = user;
            if (selectedL2User) {
                if (!acc[selectedL2User]) acc[selectedL2User] = [];
                acc[selectedL2User].push(user);
            }
            return acc;
        }, {} as Record<string, L3User[]>);

        // Group L4 users by their selectedL2User (L2 user's name)
        const groupedL4Users = l4Users.reduce((acc, user: L4User) => {
            const { selectedL2User } = user;
            if (selectedL2User) {
                if (!acc[selectedL2User]) acc[selectedL2User] = [];
                acc[selectedL2User].push(user);
            }
            return acc;
        }, {} as Record<string, L4User[]>);

        // Combine L1, L2, L3, and L4 data
        const response = l1Users.map((l1) => {
            const l2UsersForL1 = groupedL2Users[l1.name] || [];
            const l2UserCount = l2UsersForL1.length;

            const l3UsersForL1 = l2UsersForL1.reduce((acc, l2) => {
                return acc.concat(groupedL3Users[l2.name] || []);
            }, [] as L3User[]);
            const l3UserCount = l3UsersForL1.length;

            const l4UsersForL1 = l2UsersForL1.reduce((acc, l2) => {
                return acc.concat(groupedL4Users[l2.name] || []);
            }, [] as L4User[]);
            const l4UserCount = l4UsersForL1.length;

            const totalUserCount = l2UserCount + l3UserCount + l4UserCount; // Correct total calculation

            return {
                l1User: l1,
                l2UserCount,
                l3UserCount,
                l4UserCount,
                totalUserCount,
                l2Users: l2UsersForL1,
                l3Users: l3UsersForL1,
                l4Users: l4UsersForL1,
            };
        });

        console.log('Final Response:', response);
        return new NextResponse(JSON.stringify(response), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
              "Surrogate-Control": "no-store",
            },
          });
    } catch (error) {
        console.log(error)
    return new NextResponse(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
