"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingHero } from "@/lib/db/repository/pages";
import { HeroSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingHeroAction = async (
  values: z.infer<typeof HeroSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = HeroSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingHero(validated.data);
    await logLandingActivity("Landing hero updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("hero"));
    return { success: "Hero section updated" };
  } catch {
    return { error: "Could not update hero section" };
  }
};
