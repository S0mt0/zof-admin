"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingValuesSettings } from "@/lib/db/repository/pages";
import { ValuesSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingValuesAction = async (
  values: z.infer<typeof ValuesSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = ValuesSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingValuesSettings(validated.data);
    await logLandingActivity("Landing values updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("values"));
    return { success: "Values section updated" };
  } catch {
    return { error: "Could not update values section" };
  }
};
