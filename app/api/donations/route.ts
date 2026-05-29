import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  getDonationsPageData,
  listDonationCampaigns,
} from "@/lib/db/repository/pages/donations";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  try {
    const [page, campaigns] = await Promise.all([
      getDonationsPageData(),
      listDonationCampaigns(true),
    ]);

    return Response.json(
      { message: "Donation content fetched successfully", data: { ...page, campaigns } },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching donation content:", error);
    return Response.json({ message: "Something went wrong" }, { headers: corsHeaders, status: 500 });
  }
}
