"use server";
import { signOut } from "@/auth";
import { db } from "../db";

export const logout = async (userId: string) => {
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLogin: new Date(),
    },
  });

  await signOut();
};
