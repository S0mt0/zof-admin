import * as z from "zod";

export const MessageSchema = z.object({
  sender: z.string().trim().min(1, "Sender is required"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(100, "Subject too long"),
  content: z
    .string()
    .trim()
    .min(1, "Message content is required")
    .max(1000, "Message too long"),
  email: z.string().trim().email("Invalid email address"),
});
