"use server";

import * as z from "zod";

import { FoundationInfoSchema, WebsiteSettingsSchema } from "../schemas";
import {
  getFoundationInfo,
  updateFoundationInfo,
  createFoundationInfo,
  getWebsiteSettings,
  updateWebsiteSettings,
  createWebsiteSettings,
  getUserById,
} from "../db/repository";
import { currentUser } from "../utils";
import { revalidatePath } from "next/cache";

export const updateFoundationInfoAction = async (
  values: z.infer<typeof FoundationInfoSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (user.role !== "admin") return { error: "Unauthorized" };

  const validatedFields = FoundationInfoSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  try {
    const existingInfo = await getFoundationInfo();

    if (existingInfo) {
      await updateFoundationInfo(existingInfo.id, validatedFields.data);
    } else {
      await createFoundationInfo(validatedFields.data);
    }

    revalidatePath("/settings");
    return { success: "Foundation information updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateWebsiteSettingsAction = async (
  values: z.infer<typeof WebsiteSettingsSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (user.role !== "admin") return { error: "Unauthorized" };

  const validatedFields = WebsiteSettingsSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  try {
    const existingSettings = await getWebsiteSettings();

    if (existingSettings) {
      await updateWebsiteSettings(existingSettings.id, validatedFields.data);
    } else {
      await createWebsiteSettings(validatedFields.data);
    }

    revalidatePath("/settings");
    return { success: "Website settings updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
