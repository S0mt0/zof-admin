import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { prismaPaginate } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || undefined;

    const where = userId ? { userId } : {};

    const result = await prismaPaginate({
      page,
      limit,
      defaultLimit: 5,
      maxLimit: 20,
      args: { where, orderBy: { time: "desc" } },
      model: {
        count: (args: any) => db.userActivity.count(args),
        findMany: (args: any) => db.userActivity.findMany(args),
      },
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
