import { FRONTEND_BASE_URL } from "@/lib/constants";
import { listVolunteers } from "@/lib/db/repository/team.service";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  try {
    const data = await listVolunteers({
      select: {
        id: true,
        name: true,
        volunteerType: true,
        avatar: true,
        featured: true,
        facebook: true,
        x: true,
        instagram: true,
        youtube: true,
        linkedin: true,
        tiktok: true,
        threads: true,
        whatsapp: true,
        telegram: true,
        snapchat: true,
        pinterest: true,
        medium: true,
      },
    });

    return Response.json(
      { message: "Volunteers fetched successfully", data },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching volunteers:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 500,
      }
    );
  }
}
