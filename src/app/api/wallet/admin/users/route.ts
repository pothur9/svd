import dbConnect from "@/lib/dbconnect";
import l1User from "@/models/l1";
import l2User from "@/models/l2";
import l3User from "@/models/l3";
import l4User from "@/models/l4";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function verifyAdminToken(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const pass = process.env.ADMIN_WALLET_PASSWORD || "SVDAdmin@2024";
    return parts[0] === "admin" && parts[2] === pass;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level") || "all"; // l1 | l2 | l3 | l4 | all
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    // Build search filter
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
            { contactNo: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const selectFields = "userId name contactNo peeta gender createdAt walletBalance";

    // Helper to fetch from a model
    async function fetchLevel(Model: typeof l1User, levelName: string) {
      const [docs, count] = await Promise.all([
        Model.find(searchFilter).select(selectFields).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Model.countDocuments(searchFilter),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { docs: docs.map((d: any) => ({ ...d, _level: levelName })), count };
    }

    if (level === "l1") {
      const { docs, count } = await fetchLevel(l1User, "L1");
      return NextResponse.json({ users: docs, total: count, page, totalPages: Math.ceil(count / limit) });
    }
    if (level === "l2") {
      const { docs, count } = await fetchLevel(l2User, "L2");
      return NextResponse.json({ users: docs, total: count, page, totalPages: Math.ceil(count / limit) });
    }
    if (level === "l3") {
      const { docs, count } = await fetchLevel(l3User, "L3");
      return NextResponse.json({ users: docs, total: count, page, totalPages: Math.ceil(count / limit) });
    }
    if (level === "l4") {
      const { docs, count } = await fetchLevel(l4User, "L4");
      return NextResponse.json({ users: docs, total: count, page, totalPages: Math.ceil(count / limit) });
    }

    // "all" — fetch counts for summary, then merge paginated across all
    const [l1Count, l2Count, l3Count, l4Count] = await Promise.all([
      l1User.countDocuments(searchFilter),
      l2User.countDocuments(searchFilter),
      l3User.countDocuments(searchFilter),
      l4User.countDocuments(searchFilter),
    ]);
    const totalAll = l1Count + l2Count + l3Count + l4Count;

    // Fetch all in parallel and merge (suitable for admin panel with reasonable data sizes)
    const [l1Docs, l2Docs, l3Docs, l4Docs] = await Promise.all([
      l1User.find(searchFilter).select(selectFields).sort({ createdAt: -1 }).lean(),
      l2User.find(searchFilter).select(selectFields).sort({ createdAt: -1 }).lean(),
      l3User.find(searchFilter).select(selectFields).sort({ createdAt: -1 }).lean(),
      l4User.find(searchFilter).select(selectFields).sort({ createdAt: -1 }).lean(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = [
      ...l1Docs.map((d: any) => ({ ...d, _level: "L1" })),
      ...l2Docs.map((d: any) => ({ ...d, _level: "L2" })),
      ...l3Docs.map((d: any) => ({ ...d, _level: "L3" })),
      ...l4Docs.map((d: any) => ({ ...d, _level: "L4" })),
    ]
      .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
      .slice(skip, skip + limit);

    return NextResponse.json({
      users: merged,
      total: totalAll,
      page,
      totalPages: Math.ceil(totalAll / limit),
      levelCounts: { l1: l1Count, l2: l2Count, l3: l3Count, l4: l4Count },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
