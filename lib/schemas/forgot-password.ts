import * as z from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});
