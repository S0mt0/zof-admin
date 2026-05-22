"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingAboutSettings } from "@/lib/db/repository/pages";
import { AboutSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingAboutAction = async (
  values: z.infer<typeof AboutSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = AboutSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingAboutSettings(validated.data);
    await logLandingActivity("Landing about updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("about"));
    return { success: "About section updated" };
  } catch {
    return { error: "Could not update about section" };
  }
};
