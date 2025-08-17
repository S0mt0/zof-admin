import { MAIN_WEBSITE_BASE_URL } from "@/lib/constants";

export async function GET() {
  return Response.json(
    { message: "Hello blogs" },
    {
      headers: {
        "Access-Control-Allow-Origin": MAIN_WEBSITE_BASE_URL,
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}
