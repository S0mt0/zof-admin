"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { FoundationInfoSchema, WebsiteSettingsSchema } from "../schemas";
import {
  getFoundationInfo,
  updateFoundationInfo,
  createFoundationInfo,
  getWebsiteSettings,
  updateWebsiteSettings,
  createWebsiteSettings,
} from "../db/repository";

export const updateFoundationInfoAction = async (
  values: z.infer<typeof FoundationInfoSchema>
) => {
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
