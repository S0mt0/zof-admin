export async function GET(
  request: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  const { blogId } = await params;

  return Response.json(
    { message: `Hello single blog ${blogId}` },
    {
      headers: {
        "Access-Control-Allow-Origin": process.env.FRONTEND_BASE_URL!,
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}
