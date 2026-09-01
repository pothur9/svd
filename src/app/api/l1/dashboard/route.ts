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

// Base date from which growth offset starts accumulating
const BASE_DATE = new Date('2024-01-01T00:00:00Z');
const MS_PER_30_MIN = 1000 * 60 * 30; // 30 minutes in milliseconds
const USERS_PER_30_MIN = 8; // Adds 8 users every 30 minutes (16 users per hour)

function get30MinOffset(): number {
    const now = new Date();
    const intervalsSinceBase = Math.floor((now.getTime() - BASE_DATE.getTime()) / MS_PER_30_MIN);
    if (intervalsSinceBase <= 0) return 0;
    return intervalsSinceBase * USERS_PER_30_MIN;
}

function calculatePeetaOffsets(totalPeetas: number, totalOffset: number): number[] {
    if (totalPeetas === 0) return [];
    
    const offsets = new Array(totalPeetas).fill(0);
    if (totalPeetas === 1) {
        offsets[0] = totalOffset;
        return offsets;
    }

    const mainPeetaCount = Math.min(5, totalPeetas - 1);
    const hasOtherPeeta = totalPeetas > mainPeetaCount;

    let baseDistributed = 0;

    // Distribute main share (15/16) equally among the main peetas
    const mainShare = Math.floor((totalOffset * (15 / 16)) / mainPeetaCount);
    for (let i = 0; i < mainPeetaCount; i++) {
        offsets[i] = mainShare;
        baseDistributed += mainShare;
    }

    // Distribute 1/16 share to the 6th/other peeta if it exists
    if (hasOtherPeeta) {
        const otherShare = Math.floor(totalOffset / 16);
        offsets[mainPeetaCount] = otherShare;
        baseDistributed += otherShare;
    }

    // Distribute any remainder round-robin to ensure total equals totalOffset
    let remainder = totalOffset - baseDistributed;
    let idx = 0;
    while (remainder > 0) {
        offsets[idx % totalPeetas] += 1;
        remainder--;
        idx++;
    }

    return offsets;
}

export async function GET() {
    await dbConnect();

    try {
        // Fetch all L1, L2, L3, and L4 users
        const l1Users = await l1User.find().lean();
        const l2Users = (await l2User.find().lean()) as unknown as L2User[];
        const l3Users = (await l3User.find().lean()) as unknown as L3User[];
        const l4Users = (await l4User.find().lean()) as unknown as L4User[];

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
            const found = l1PeetaKeys.find(p => p.key.includes(up) || up.includes(p.key));
            return found?.key || up;
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

        // Calculate dynamic growth offset and distribute among peetas
        const totalGrowthOffset = get30MinOffset();
        const peetaOffsets = calculatePeetaOffsets(l1Users.length, totalGrowthOffset);

        // Combine L1, L2, L3, and L4 data
        const response = l1Users.map((l1, index) => {
            const l1PeetaKey = l1.peeta?.trim().toLowerCase();
            const l2UsersForL1 = groupedL2Users[l1PeetaKey] || [];
            const l2UserCount = l2UsersForL1.length;

            const peetaOffset = peetaOffsets[index] || 0;
            const l3Offset = Math.floor(peetaOffset / 2);
            const l4Offset = peetaOffset - l3Offset;

            const l3UsersForL1 = groupedL3ByPeeta[l1PeetaKey] || [];
            const l3UserCount = l3UsersForL1.length + l3Offset;

            const l4UsersForL1 = groupedL4ByPeeta[l1PeetaKey] || [];
            const l4UserCount = l4UsersForL1.length + l4Offset;

            const totalUserCount = l2UserCount + l3UserCount + l4UserCount;

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
