"use server";

import { getUserById, deleteUser } from "../db/repository";
import { signOut } from "@/auth";

export const deleteAccount = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    return { error: "User not found!" };
  }

  const deletedUser = await deleteUser(userId);

  if (!deletedUser) {
    return { error: "Failed to delete account. Please try again." };
  }

  await signOut();
};
