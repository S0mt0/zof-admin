import { MAIN_WEBSITE_BASE_URL } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  return Response.json(
    { message: `Hello single event ${eventId}` },
    {
      headers: {
        "Access-Control-Allow-Origin": MAIN_WEBSITE_BASE_URL,
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}
