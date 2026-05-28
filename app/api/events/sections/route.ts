import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getEventsPageData } from "@/lib/db/repository/pages/events";

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
    const events = await getEventsPageData();

    const data = {
      hero: {
        ...events.hero,
      },
      archive: {
        ...events.archive,
      },
    };

    return Response.json(
      { message: "Events content fetched successfully", data },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events content:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      { headers: corsHeaders, status: 500 }
    );
  }
}
