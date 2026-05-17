import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  listTeamMembers,
  listVolunteers,
} from "@/lib/db/repository/team.service";

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
    const [teamMembers, volunteers] = await Promise.all([
      listTeamMembers({
        where: { status: "active" },
        select: {
          name: true,
          role: true,
          email: true,
          bio: true,
          avatar: true,
        },
      }),
      listVolunteers({
        select: {
          name: true,
          volunteerType: true,
          avatar: true,
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
      }),
    ]);

    return Response.json(
      { message: "Team members fetched successfully", teamMembers, volunteers },
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
    console.error("Error fetching team members:", error);

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
