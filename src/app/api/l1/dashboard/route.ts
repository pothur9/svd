import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l1User from '@/models/l1';
import l2User from '@/models/l2';
import l3User from '@/models/l3';
import l4User from '@/models/l4'; // Assuming there's an L4 model

export const dynamic = "force-dynamic";

interface L2User {
    name: string;
    peeta: string;
    // Add other fields based on your model
}

interface L3User {
    name: string;
    selectedL2User: string;
    peeta?: string;
    // Add other fields based on your model
}

interface L4User {
    name: string;
    selectedL2User: string;
    peeta?: string;
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

      

        // Group L2 users by their peeta (L1 user peeta, case-insensitive, trimmed)
        const groupedL2Users = l2Users.reduce((acc, user: L2User) => {
            const peetaKey = user.peeta?.trim().toLowerCase();
            if (peetaKey) {
                if (!acc[peetaKey]) acc[peetaKey] = [];
                acc[peetaKey].push(user);
            }
            return acc;
        }, {} as Record<string, L2User[]>);

        // Build canonical keys for L1 peeta values
        const l1PeetaKeys = l1Users.map(l1 => ({
            raw: l1.peeta,
            key: (l1.peeta || '').trim().toLowerCase(),
        }));

        // Helper to map a user peeta string to the closest L1 peeta key via substring match
        const mapToL1PeetaKey = (userPeeta?: string) => {
            const up = (userPeeta || '').trim().toLowerCase();
            if (!up) return '';
            // Find an L1 key that includes the user's peeta term (e.g., 'kashi' matches 'sri kashi peeta ...')
            const found = l1PeetaKeys.find(p => p.key.includes(up) || up.includes(p.key));
            return found?.key || up; // fallback to the user string itself
        };

        // Group L3 users by mapped L1 peeta key
        const groupedL3ByPeeta = l3Users.reduce((acc, user: L3User) => {
            const key = mapToL1PeetaKey(user.peeta);
            if (key) {
                if (!acc[key]) acc[key] = [];
                acc[key].push(user);
            }
            return acc;
        }, {} as Record<string, L3User[]>);

        // Group L4 users by mapped L1 peeta key
        const groupedL4ByPeeta = l4Users.reduce((acc, user: L4User) => {
            const key = mapToL1PeetaKey(user.peeta);
            if (key) {
                if (!acc[key]) acc[key] = [];
                acc[key].push(user);
            }
            return acc;
        }, {} as Record<string, L4User[]>);

        // Combine L1, L2, L3, and L4 data
        const response = l1Users.map((l1) => {
            const l1PeetaKey = l1.peeta?.trim().toLowerCase();
            const l2UsersForL1 = groupedL2Users[l1PeetaKey] || [];
            const l2UserCount = l2UsersForL1.length;

            const l3UsersForL1 = groupedL3ByPeeta[l1PeetaKey] || [];
            const l3UserCount = l3UsersForL1.length;

            const l4UsersForL1 = groupedL4ByPeeta[l1PeetaKey] || [];
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
