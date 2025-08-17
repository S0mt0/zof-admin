import * as z from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain a number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain a special character",
      }),
    confirm_password: z.string({ message: "Enter password again" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
