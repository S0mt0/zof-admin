import { revalidatePath } from "next/cache";

import { syncUnresolvedDonations } from "@/lib/services/donations/sync-unresolved-donations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getSyncSecret = () =>
  process.env.DONATION_SYNC_SECRET || process.env.CRON_SECRET || "";

const isAuthorized = (request: Request) => {
  const secret = getSyncSecret();
  if (!secret) return false;

  const authHeader = request.headers.get("authorization") || "";
  const token = new URL(request.url).searchParams.get("secret") || "";

  return authHeader === `Bearer ${secret}` || token === secret;
};

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncUnresolvedDonations();
    revalidatePath("/donations/manage");
    revalidatePath("/donations/subscriptions");

    return Response.json({
      message: "Donation sync completed",
      data: result,
    });
  } catch (error) {
    console.error("Donation cron sync failed", error);
    return Response.json(
      { message: "Could not sync donations" },
      { status: 500 }
    );
  }
}
