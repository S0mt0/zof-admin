import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getAboutPageData } from "@/lib/db/repository/pages/about";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const publishedCtas = (items: CtaButtonContent[] = []) =>
  items
    .filter((item) => item.published)
    .sort((a, b) => a.order - b.order)
    .slice(0, 2);

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  try {
    const about = await getAboutPageData();
    const data = {
      hero: about.hero,
      story: about.story,
      team: about.team,
      foundersMessage: {
        ...about.foundersMessage,
        ctas: publishedCtas(about.foundersMessage.ctas),
      },
      cta: {
        ...about.cta,
        ctas: publishedCtas(about.cta.ctas),
      },
      updatedAt: about.updatedAt,
    };

    return Response.json(
      { message: "About page fetched successfully", data },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching about page:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      { headers: corsHeaders, status: 500 }
    );
  }
}
