"use server";
import * as z from "zod";

import { ForgotPasswordSchema } from "../schemas";
import { getUserByEmail } from "../db/data";
import { generateResetPasswordToken, obscureEmail } from "../utils";
import { MailService } from "../utils/mail.service";

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>
) => {
  const validatedField = ForgotPasswordSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid email" };

  const { email } = validatedField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "Email not found" };

  const token = (await generateResetPasswordToken(email)).token;
  const mailer = new MailService();

  await mailer.sendResetPasswordEmail(email, token);

  return {
    success: `Reset email sent to ${obscureEmail(email)}`,
  };
};
