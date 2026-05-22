"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  updateLandingFeaturedBlogsSettings,
  updateLandingFeaturedEventsSettings,
} from "@/lib/db/repository/pages";
import { FeaturedContentSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingFeaturedBlogsAction = async (
  values: z.infer<typeof FeaturedContentSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FeaturedContentSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFeaturedBlogsSettings(validated.data);
    await logLandingActivity(
      "Landing featured blogs updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("featured-blogs"));
    return { success: "Featured blogs section updated" };
  } catch {
    return { error: "Could not update featured blogs section" };
  }
};

export const updateLandingFeaturedEventsAction = async (
  values: z.infer<typeof FeaturedContentSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FeaturedContentSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFeaturedEventsSettings(validated.data);
    await logLandingActivity(
      "Landing featured events updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("featured-events"));
    return { success: "Featured events section updated" };
  } catch {
    return { error: "Could not update featured events section" };
  }
};
