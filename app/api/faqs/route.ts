import { FRONTEND_BASE_URL } from "@/lib/constants";
import { listLandingFaqs } from "@/lib/db/repository/pages.service";

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
    const data = await listLandingFaqs({
      where: { published: true },
      select: {
        question: true,
        answer: true,
        order: true,
      },
    });

    return Response.json(
      { message: "FAQs fetched successfully", data },
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
    console.error("Error fetching FAQs:", error);

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
