import { FRONTEND_BASE_URL } from "@/lib/constants";
import { createEventComment } from "@/lib/db/repository/comments.service";
import { EventCommentSchema } from "@/lib/schemas/comments.";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const validatedFields = EventCommentSchema.safeParse(body);
  if (!validatedFields.success) {
    return Response.json(
      { message: validatedFields.error.errors[0].message },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 400,
      }
    );
  }

  const payload = validatedFields.data;
  try {
    await createEventComment(payload);
    return Response.json(
      { message: "Success" },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating event comment:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 500,
      }
    );
  }
}
