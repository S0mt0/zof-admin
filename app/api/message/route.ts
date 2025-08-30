import { FRONTEND_BASE_URL } from "@/lib/constants";
import { db } from "@/lib/db/config";
import { MessageSchema } from "@/lib/schemas/messages";
import { MailService } from "@/lib/utils/mail.service";

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

  const validatedFields = MessageSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json(
      { message: validatedFields.error.errors[0].message },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
        },
        status: 400,
      }
    );
  }

  const data = validatedFields.data;

  try {
    await db.message.create({ data });

    const mailer = new MailService();
    await mailer.send({
      subject: data.subject,
      to: "zitaonyekafoundation@gmail.com",
      text: `You have a new message from ${data.sender} (${data.email}):
    
    ${data.content}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #444;">New Message Received</h2>
          <p><strong>From:</strong> ${data.sender} &lt;${data.email}&gt;</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 1em 0;">
          <p style="white-space: pre-wrap;">${data.content}</p>
        </div>
      `,
    });

    return Response.json(
      { message: "Message sent successfully" },
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
