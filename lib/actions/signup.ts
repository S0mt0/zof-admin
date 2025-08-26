"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { SignUpSchema } from "../schemas";
import { createUser, getUserByEmail } from "../db/repository";
import { generateVerificationToken } from "../utils";
import { MailService } from "../utils/mail.service";
import { allowedAdminEmailsList } from "../constants";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedField = SignUpSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid fields, try again." };

  const { password, email, name } = validatedField.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email taken, try another one." };

  await createUser({
    name,
    email: email.toLocaleLowerCase(),
    password: hashedPassword,
    role: allowedAdminEmailsList.includes(email) ? "admin" : "user",
  });

  const token = (await generateVerificationToken(email)).token;
  const mailer = new MailService();

  await mailer.sendVerificationEmail(email, token);

  return { success: "Confirmation email sent!" };
};
