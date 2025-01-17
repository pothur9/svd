import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import l1User from '@/models/l1';
import l2User from '@/models/l2';
import l3User from '@/models/l3';
import l4User from '@/models/l4'; // Assuming there's an L4 model

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        // Fetch all L1, L2, L3, and L4 users
        const l1Users = await l1User.find().lean();
        const l2Users = await l2User.find().lean();
        const l3Users = await l3User.find().lean();
        const l4Users = await l4User.find().lean(); // Fetch L4 users

        if (!l1Users || l1Users.length === 0) {
            console.warn('No L1 users found');
            return NextResponse.json({ message: 'No L1 users found' }, { status: 404 });
        }

        // Group L2 users by their peeta (L1 user name)
        const groupedL2Users = l2Users.reduce((acc, user) => {
            const { peeta } = user; // 'peeta' is the L1 user's name
            if (peeta) {
                if (!acc[peeta]) acc[peeta] = [];
                acc[peeta].push(user);
            }
            return acc;
        }, {} as Record<string, any[]>);

        // Group L3 users by their selectedL2User (L2 user's name)
        const groupedL3Users = l3Users.reduce((acc, user) => {
            const { selectedL2User } = user; // 'selectedL2User' is the L2 user's name
            if (selectedL2User) {
                if (!acc[selectedL2User]) acc[selectedL2User] = [];
                acc[selectedL2User].push(user);
            }
            return acc;
        }, {} as Record<string, any[]>);

        // Group L4 users by their selectedL2User (L2 user's name)
        const groupedL4Users = l4Users.reduce((acc, user) => {
            const { selectedL2User } = user; // 'selectedL2User' is the L2 user's name
            if (selectedL2User) {
                if (!acc[selectedL2User]) acc[selectedL2User] = [];
                acc[selectedL2User].push(user);
            }
            return acc;
        }, {} as Record<string, any[]>);

        // Combine L1, L2, L3, and L4 data
        const response = l1Users.map((l1) => {
            const l2UsersForL1 = groupedL2Users[l1.name] || [];
            const l2UserCount = l2UsersForL1.length;

            const l3UsersForL1 = l2UsersForL1.reduce((acc, l2) => {
                return acc.concat(groupedL3Users[l2.name] || []);
            }, [] as any[]);
            const l3UserCount = l3UsersForL1.length;

            const l4UsersForL1 = l2UsersForL1.reduce((acc, l2) => {
                return acc.concat(groupedL4Users[l2.name] || []);
            }, [] as any[]);
            const l4UserCount = l4UsersForL1.length;

            const totalUserCount = l2UserCount + l3UserCount + l4UserCount; // Correct total calculation

            return {
                l1User: l1,
                l2UserCount,
                l3UserCount,
                l4UserCount,
                totalUserCount, // Corrected total
                l2Users: l2UsersForL1,
                l3Users: l3UsersForL1,
                l4Users: l4UsersForL1,
            };
        });

        console.log('Final Response:', response);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching grouped users:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
