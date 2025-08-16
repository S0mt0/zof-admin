export async function GET() {
  return Response.json(
    { message: "Hello donations" },
    {
      headers: {
        "Access-Control-Allow-Origin": process.env.FRONTEND_BASE_URL!,
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}
