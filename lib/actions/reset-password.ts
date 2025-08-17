"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "../db";
import { getResetPasswordTokenByToken, getUserByEmail } from "../db/data";
import { ResetPasswordSchema } from "../schemas";

export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema>,
  token: string
) {
  const existingToken = await getResetPasswordTokenByToken(token);
  if (!existingToken) return { error: "Token does not exist!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Session expired, please try again." };

  const validatedField = ResetPasswordSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid fields, try again." };

  const { password } = validatedField.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User does not exist!" };

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await db.resetPasswordToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password changed successfully 🎉" };
}
