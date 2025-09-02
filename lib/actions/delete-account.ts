"use server";

import { getUserById, deleteUser } from "../db/repository";
import { signOut } from "@/auth";
import { currentUser } from "../utils";

export const deleteAccount = async () => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };

  const deleted = await deleteUser(user.id);

  if (!deleted) return { error: "Failed to delete account. Please try again." };

  await signOut();
};
