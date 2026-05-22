"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  reorderTestimonials,
  updateTestimonial,
} from "@/lib/db/repository/pages";
import { TestimonialSchema } from "@/lib/schemas";

import {
  getAuthorizedUser,
  IdsSchema,
  logLandingActivity,
  sectionPath,
} from "../shared";

export const createTestimonialAction = async (
  values: z.infer<typeof TestimonialSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = TestimonialSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const testimonials = await listTestimonials();
    const created = await createTestimonial({
      ...validated.data,
      order:
        testimonials.reduce((max, item) => Math.max(max, item.order), -1) + 1,
    });
    if (!created) return { error: "Could not add testimonial" };

    await logLandingActivity("Testimonial added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonial added" };
  } catch {
    return { error: "Could not add testimonial" };
  }
};

export const updateTestimonialAction = async (
  id: string,
  values: z.infer<typeof TestimonialSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = TestimonialSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const updated = await updateTestimonial(id, validated.data);
    if (!updated) return { error: "Could not update testimonial" };

    await logLandingActivity("Testimonial updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonial updated" };
  } catch {
    return { error: "Could not update testimonial" };
  }
};

export const deleteTestimonialAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    const deleted = await deleteTestimonial(id);
    if (!deleted) return { error: "Could not delete testimonial" };

    await logLandingActivity("Testimonial deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonial deleted" };
  } catch {
    return { error: "Could not delete testimonial" };
  }
};

export const reorderTestimonialsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    const ok = await reorderTestimonials(validated.data);
    if (!ok) return { error: "Could not update order" };

    revalidatePath(sectionPath("testimonials"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};
