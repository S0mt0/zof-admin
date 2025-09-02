"use server";

import * as z from "zod";
import { revalidateTag } from "next/cache";

import { FoundationInfoSchema, WebsiteSettingsSchema } from "../schemas";
import {
  getFoundationInfo,
  updateFoundationInfo,
  createFoundationInfo,
  getWebsiteSettings,
  updateWebsiteSettings,
  createWebsiteSettings,
} from "../db/repository";
import { currentUser } from "../utils";

export const updateFoundationInfoAction = async (
  values: z.infer<typeof FoundationInfoSchema>
) => {
  const user = await currentUser();
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
    revalidateTag("info");
    return { success: "Foundation information updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateWebsiteSettingsAction = async (
  values: z.infer<typeof WebsiteSettingsSchema>
) => {
  const user = await currentUser();
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

    revalidateTag("settings");
    return { success: "Website settings updated successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
