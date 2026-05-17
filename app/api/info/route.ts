import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getFoundationInfo } from "@/lib/db/repository/settings.service";

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
    const data = await getFoundationInfo({
      address: true,
      description: true,
      email: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      medium: true,
      name: true,
      phone: true,
      pinterest: true,
      snapchat: true,
      telegram: true,
      threads: true,
      tiktok: true,
      whatsapp: true,
      x: true,
      youtube: true,
    });

    return Response.json(
      { message: "Settings fetched successfully", data },
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
