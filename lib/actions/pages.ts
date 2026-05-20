"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  AboutPageSchema,
  LandingExtraSchema,
  LandingFaqSchema,
  LandingStatSchema,
  LandingTestimonialSchema,
} from "../schemas";
import {
  createLandingFaq,
  createLandingStat,
  createLandingTestimonial,
  deleteLandingFaq,
  deleteLandingStat,
  deleteLandingTestimonial,
  updateLandingFaq,
  updateLandingStat,
  updateLandingTestimonial,
  upsertAboutPage,
  upsertLandingExtra,
} from "../db/repository/pages.service";
import { getUserById } from "../db/repository/user.service";
import { addAppActivity } from "../db/repository/app-activity.service";
import { currentUser } from "../utils";
import { EDITORIAL_ROLES } from "../constants";

const getAuthorizedUser = async () => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  return { user };
};

export const updateAboutPageAction = async (
  values: z.infer<typeof AboutPageSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutPageSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const saved = await upsertAboutPage(validated.data);
    if (!saved) return { error: "Could not update about page" };

    await addAppActivity(
      "About page updated",
      `${auth.user.name} (${auth.user.role}) updated About Us content`
    );

    revalidatePath("/about");
    return { success: "About page updated" };
  } catch (error) {
    return { error: "Could not update about page" };
  }
};

export const createLandingFaqAction = async (
  values: z.infer<typeof LandingFaqSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingFaqSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const created = await createLandingFaq(validated.data);
    if (!created) return { error: "Could not add FAQ" };

    await addAppActivity(
      "Landing FAQ added",
      `${auth.user.name} (${auth.user.role}) added a landing page FAQ`
    );

    revalidatePath("/landing/faqs");
    return { success: "FAQ added" };
  } catch (error) {
    return { error: "Could not add FAQ" };
  }
};

export const updateLandingFaqAction = async (
  id: string,
  values: z.infer<typeof LandingFaqSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingFaqSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const updated = await updateLandingFaq(id, validated.data);
    if (!updated) return { error: "Could not update FAQ" };

    await addAppActivity(
      "Landing FAQ updated",
      `${auth.user.name} (${auth.user.role}) updated a landing page FAQ`
    );

    revalidatePath("/landing/faqs");
    return { success: "FAQ updated" };
  } catch (error) {
    return { error: "Could not update FAQ" };
  }
};

export const deleteLandingFaqAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    const deleted = await deleteLandingFaq(id);
    if (!deleted) return { error: "Could not delete FAQ" };

    await addAppActivity(
      "Landing FAQ deleted",
      `${auth.user.name} (${auth.user.role}) deleted a landing page FAQ`
    );

    revalidatePath("/landing/faqs");
    return { success: "FAQ deleted" };
  } catch (error) {
    return { error: "Could not delete FAQ" };
  }
};

export const createLandingTestimonialAction = async (
  values: z.infer<typeof LandingTestimonialSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingTestimonialSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const created = await createLandingTestimonial(validated.data);
    if (!created) return { error: "Could not add testimonial" };

    await addAppActivity(
      "Testimonial added",
      `${auth.user.name} (${auth.user.role}) added a testimonial`
    );

    revalidatePath("/landing/testimonials");
    return { success: "Testimonial added" };
  } catch (error) {
    return { error: "Could not add testimonial" };
  }
};

export const updateLandingTestimonialAction = async (
  id: string,
  values: z.infer<typeof LandingTestimonialSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingTestimonialSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const updated = await updateLandingTestimonial(id, validated.data);
    if (!updated) return { error: "Could not update testimonial" };

    await addAppActivity(
      "Testimonial updated",
      `${auth.user.name} (${auth.user.role}) updated a testimonial`
    );

    revalidatePath("/landing/testimonials");
    return { success: "Testimonial updated" };
  } catch (error) {
    return { error: "Could not update testimonial" };
  }
};

export const deleteLandingTestimonialAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    const deleted = await deleteLandingTestimonial(id);
    if (!deleted) return { error: "Could not delete testimonial" };

    await addAppActivity(
      "Testimonial deleted",
      `${auth.user.name} (${auth.user.role}) deleted a testimonial`
    );

    revalidatePath("/landing/testimonials");
    return { success: "Testimonial deleted" };
  } catch (error) {
    return { error: "Could not delete testimonial" };
  }
};

export const createLandingStatAction = async (
  values: z.infer<typeof LandingStatSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingStatSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const created = await createLandingStat(validated.data);
    if (!created) return { error: "Could not add stat" };

    await addAppActivity(
      "Landing stat added",
      `${auth.user.name} (${auth.user.role}) added a landing stat`
    );

    revalidatePath("/landing/stats");
    return { success: "Stat added" };
  } catch (error) {
    return { error: "Could not add stat" };
  }
};

export const updateLandingStatAction = async (
  id: string,
  values: z.infer<typeof LandingStatSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingStatSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const updated = await updateLandingStat(id, validated.data);
    if (!updated) return { error: "Could not update stat" };

    await addAppActivity(
      "Landing stat updated",
      `${auth.user.name} (${auth.user.role}) updated a landing stat`
    );

    revalidatePath("/landing/stats");
    return { success: "Stat updated" };
  } catch (error) {
    return { error: "Could not update stat" };
  }
};

export const deleteLandingStatAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    const deleted = await deleteLandingStat(id);
    if (!deleted) return { error: "Could not delete stat" };

    await addAppActivity(
      "Landing stat deleted",
      `${auth.user.name} (${auth.user.role}) deleted a landing stat`
    );

    revalidatePath("/landing/stats");
    return { success: "Stat deleted" };
  } catch (error) {
    return { error: "Could not delete stat" };
  }
};

export const updateLandingExtraAction = async (
  values: z.infer<typeof LandingExtraSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = LandingExtraSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const saved = await upsertLandingExtra(validated.data);
    if (!saved) return { error: "Could not update landing extra" };

    await addAppActivity(
      "Landing extra updated",
      `${auth.user.name} (${auth.user.role}) updated landing extra assets`
    );

    revalidatePath("/landing/extra");
    return { success: "Landing extra updated" };
  } catch (error) {
    return { error: "Could not update landing extra" };
  }
};
