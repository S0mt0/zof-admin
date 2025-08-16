"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { SignUpSchema } from "../schemas";
import { db } from "../db";
import { getUserByEmail } from "../db/data";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedField = SignUpSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid fields, try again." };

  const { password, email, name } = validatedField.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email taken, try another one." };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Todo: Send verification email

  return { success: "Verification email sent" };
};
