"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import {
  ProfileSchema,
  EmailUpdateSchema,
  PasswordUpdateSchema,
  NotificationPreferencesSchema,
} from "../schemas";
import { getUserByEmail, getUserById, updateUser } from "../db/repository";
import { update } from "@/auth";
import { capitalize, currentUser, generateVerificationToken } from "../utils";
import { MailService } from "../utils/mail.service";

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };

  const validatedFields = ProfileSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const name = validatedFields.data?.name;
  let payload = validatedFields.data;

  if (name) {
    payload = { ...validatedFields.data, name: capitalize(name) };
  }

  try {
    await updateUser(user.id, payload);

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

    return { success: "Profile image updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateEmail = async (
  values: z.infer<typeof EmailUpdateSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!user.password) return { error: "Invalid request" };

  const validatedFields = EmailUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  try {
    // Check if email is already taken by another user
    const emailExists = await getUserByEmail(email);
    if (emailExists) return { error: "Email taken, try another one." };

    if (user?.email === email) {
      return { error: "Email is already set to this value" };
    }

    const updated = await updateUser(user.id, {
      email: email,
      emailVerified: null,
    }); // Reset email verification since email changed

    if (updated) {
      const token = (await generateVerificationToken(email)).token;
      const mailer = new MailService();

      await mailer.sendVerificationEmail(email, token);

      await update({ user: { email: user?.email } });

      return {
        success:
          "Email updated successfully! A confirmation mail has been sent to your new email.",
      };
    } else {
      return {
        error: "Something went wrong, try again",
      };
    }
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updatePassword = async (
  values: z.infer<typeof PasswordUpdateSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!user.password) return { error: "Invalid request" };

  const validatedFields = PasswordUpdateSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
      return { error: "Current password is incorrect!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await updateUser(user.id, { password: hashedPassword });

    return { success: "Password updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateNotificationPreferences = async (
  values: z.infer<typeof NotificationPreferencesSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };

  const validatedFields = NotificationPreferencesSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    await updateUser(user.id, validatedFields.data);

    return { success: "Notification preferences updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
