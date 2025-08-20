import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    console.log(
      "🔄 API: /api/activity-stats called at:",
      new Date().toISOString()
    );

    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    // If userId is provided, we can use it downstream (profile reuse),
    // but for dashboard totals we count all records
    const [blogs, events, team, messages] = await Promise.all([
      db.blog.count(userId ? { where: { authorId: userId } } : undefined),
      db.event.count(userId ? { where: { organizerId: userId } } : undefined),
      db.teamMember.count(userId ? { where: { addedBy: userId } } : undefined),
      db.message.count(userId ? { where: { senderId: userId } } : undefined),
    ]);

    const data = { blogs, events, team, messages };
    console.log("✅ API: Returning data:", data);

    const response = NextResponse.json(data);

    // Add cache control headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    response.headers.set("X-Cache-Status", "HIT");
    response.headers.set("X-Response-Time", new Date().toISOString());

    return response;
  } catch (e) {
    console.error("❌ API: Error fetching activity stats:", e);
    return NextResponse.json(
      { error: "Failed to fetch activity stats" },
      { status: 500 }
    );
  }
}
