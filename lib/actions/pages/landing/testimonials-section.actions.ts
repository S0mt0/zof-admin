"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateLandingTestimonialsSettings } from "@/lib/db/repository/pages";
import { TestimonialsSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser, logLandingActivity, sectionPath } from "../shared";

export const updateLandingTestimonialsSectionAction = async (
  values: z.infer<typeof TestimonialsSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = TestimonialsSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingTestimonialsSettings(validated.data);
    await logLandingActivity(
      "Landing testimonials updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonials section updated" };
  } catch {
    return { error: "Could not update testimonials section" };
  }
};
