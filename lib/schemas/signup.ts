import * as z from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string({ message: "Name is required" })
      .min(4, { message: "Name is too short" }),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Email is required" })
      .trim()
      .toLowerCase(),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain a number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain a special character",
      }),
    confirm_password: z.string({ message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
