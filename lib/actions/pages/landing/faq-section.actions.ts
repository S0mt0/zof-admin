"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingFaqSettings } from "@/lib/db/repository/pages";
import { FaqSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingFaqSectionAction = async (
  values: z.infer<typeof FaqSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FaqSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFaqSettings(validated.data);
    await logLandingActivity("Landing FAQ updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ section updated" };
  } catch {
    return { error: "Could not update FAQ section" };
  }
};
