"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateDonationAside } from "@/lib/db/repository/pages/donations";
import { DonationsAsideSectionSchema } from "@/lib/schemas/pages/donations";

import { getAuthorizedDonationAdmin, logDonationActivity, sectionPath } from "./shared";

export const updateDonationAsideAction = async (
  values: z.infer<typeof DonationsAsideSectionSchema>
) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  const validated = DonationsAsideSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateDonationAside(validated.data);
    await logDonationActivity("Donation aside updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("aside"));
    return { success: "Donation aside updated" };
  } catch {
    return { error: "Could not update donation aside" };
  }
};
