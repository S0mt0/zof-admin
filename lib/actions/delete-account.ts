"use server";

import { getUserById, deleteUser } from "../db/repository";
import { signOut } from "@/auth";

export const deleteAccount = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return { error: "User not found" };
    }

    const deleted = await deleteUser(userId);

    if (!deleted) {
      return { error: "Failed to delete account. Please try again." };
    }

    await signOut();
  } catch (error) {
    console.log("error deleting account: ", error);

    return { error: "Error deleting account, try again." };
  }
};
