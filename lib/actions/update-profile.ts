"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import {
  ProfileSchema,
  EmailUpdateSchema,
  PasswordUpdateSchema,
  NotificationPreferencesSchema,
} from "../schemas";
import { getUserByEmail, getUserById, updateUser } from "../db/data";

export const updateProfile = async (
  values: z.infer<typeof ProfileSchema>,
  userId: string
) => {
  const validatedFields = ProfileSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  try {
    await updateUser(userId, validatedFields.data);

    revalidatePath("/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateProfileImage = async (imageUrl: string, userId: string) => {
  if (!imageUrl || !userId) {
    return { error: "Invalid image or user!" };
  }

  try {
    await updateUser(userId, { image: imageUrl });
    revalidatePath("/profile");
    return { success: "Profile image updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateEmail = async (
  values: z.infer<typeof EmailUpdateSchema>,
  userId: string
) => {
  const validatedFields = EmailUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  try {
    // Check if email is already taken by another user
    const emailExists = await getUserByEmail(email.trim());
    if (emailExists) return { error: "Email taken, try another one." };

    const existingUser = await getUserById(userId);
    if (existingUser?.email === email.trim()) {
      return { error: "Email is already set to this value!" };
    }

    await updateUser(userId, { email: email.trim(), emailVerified: null }); // Reset email verification since email changed

    revalidatePath("/profile");
    return {
      success: "Email updated successfully! Please verify your new email.",
    };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updatePassword = async (
  values: z.infer<typeof PasswordUpdateSchema>,
  userId: string
) => {
  const validatedFields = PasswordUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await getUserById(userId);
    if (!user || !user.password) {
      return { error: "User not found or no password set!" };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return { error: "Current password is incorrect!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await updateUser(userId, { password: hashedPassword });

    revalidatePath("/profile");
    return { success: "Password updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateNotificationPreferences = async (
  values: z.infer<typeof NotificationPreferencesSchema>,
  userId: string
) => {
  const validatedFields = NotificationPreferencesSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    await updateUser(userId, validatedFields.data);
    revalidatePath("/profile");
    return { success: "Notification preferences updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
