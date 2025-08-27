import { FRONTEND_BASE_URL } from "@/lib/constants";

export async function GET() {
  return Response.json(
    { message: "Hello teams" },
    {
      headers: {
        "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}
