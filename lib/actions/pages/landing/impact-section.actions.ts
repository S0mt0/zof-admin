"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingImpactSettings } from "@/lib/db/repository/pages";
import { ImpactSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingImpactAction = async (
  values: z.infer<typeof ImpactSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = ImpactSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingImpactSettings(validated.data);
    await logLandingActivity("Landing impact updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Impact section updated" };
  } catch {
    return { error: "Could not update impact section" };
  }
};
