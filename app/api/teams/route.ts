import { FRONTEND_BASE_URL } from "@/lib/constants";
import { listTeamMembers } from "@/lib/db/repository/team.service";

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
    const teamMembers = await listTeamMembers({
      where: { status: "active" },
      select: {
        name: true,
        role: true,
        email: true,
        bio: true,
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
        twitter: true,
        github: true,
      },
    });
    const data = teamMembers.map((member) => ({
      ...member,
      x: member.x || member.twitter,
    }));

    return Response.json(
      { message: "Team members fetched successfully", data },
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
