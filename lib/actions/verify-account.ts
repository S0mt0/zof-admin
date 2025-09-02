"use server";

import { db } from "../db/config";
import {
  addAppActivity,
  getUserByEmail,
  getVerificationTokenByToken,
} from "../db/repository";

export async function verifyToken(token: string) {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "Token does not exist!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User does not exist!" };

  const user = await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  await addAppActivity(
    user.id,
    "Email verified",
    "You successfully verified your account email address"
  );

  return { success: "Email verified 🎉" };
}
