import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getBlogsPageData } from "@/lib/db/repository/pages/blogs";

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
    const blogs = await getBlogsPageData();

    const data = {
      hero: {
        ...blogs.hero,
      },
    };

    return Response.json(
      { message: "Blogs content fetched successfully", data },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blogs content:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      { headers: corsHeaders, status: 500 }
    );
  }
}
