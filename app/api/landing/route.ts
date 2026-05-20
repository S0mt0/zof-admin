import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  getLandingExtra,
  listLandingFaqs,
  listLandingStats,
  listLandingTestimonials,
} from "@/lib/db/repository/pages.service";

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
    const [faqs, testimonials, stats, extra] = await Promise.all([
      listLandingFaqs({
        where: { published: true },
        select: {
          question: true,
          answer: true,
          order: true,
        },
      }),
      listLandingTestimonials({
        where: { published: true },
        select: {
          name: true,
          role: true,
          quote: true,
          avatar: true,
          order: true,
        },
      }),
      listLandingStats({
        where: { published: true },
        select: {
          value: true,
          title: true,
          order: true,
        },
      }),
      getLandingExtra({
        heroImage: true,
        themeVideo: true,
        themeVideoPoster: true,
        themeVideoFile: true,
        aboutImage: true,
        updatedAt: true,
      }),
    ]);

    return Response.json(
      {
        message: "Landing content fetched successfully",
        data: { faqs, testimonials, stats, extra },
      },
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
    console.error("Error fetching landing content:", error);

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
