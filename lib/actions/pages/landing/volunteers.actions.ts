"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingVolunteersSettings } from "@/lib/db/repository/pages";
import { VolunteersSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingVolunteersAction = async (
  values: z.infer<typeof VolunteersSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = VolunteersSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingVolunteersSettings(validated.data as VolunteersSectionContent);
    await logLandingActivity(
      "Landing volunteers updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("volunteers"));
    return { success: "Volunteers section updated" };
  } catch {
    return { error: "Could not update volunteers section" };
  }
};
