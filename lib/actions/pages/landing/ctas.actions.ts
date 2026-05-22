"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createLandingCta,
  deleteLandingCta,
  getLandingPageData,
  reorderLandingCtas,
  updateLandingCta,
} from "@/lib/db/repository/pages";
import { CtaButtonSchema } from "@/lib/schemas";

import {
  getAuthorizedUser,
  IdsSchema,
  logLandingActivity,
  sectionPath,
} from "../shared";

const CtaSectionSchema = z.enum([
  "hero",
  "about",
  "values",
  "volunteers",
  "impact",
  "testimonials",
  "featuredBlogs",
  "featuredEvents",
  "faqs",
]);

const getCtaSectionPath = (section: LandingSection) =>
  sectionPath(
    section === "featuredBlogs"
      ? "featured-blogs"
      : section === "featuredEvents"
      ? "featured-events"
      : section
  );

const validatePublishedCtaLimit = async (
  section: LandingSection,
  published: boolean,
  currentId?: string
) => {
  if (!published) return "";

  const page = await getLandingPageData();
  const ctas = ((page[section] as { ctas?: CtaButtonContent[] }).ctas || [])
    .filter((cta) => cta.published)
    .filter((cta) => cta.id !== currentId);

  return ctas.length >= 2 ? "Only 2 CTA buttons can be published at once" : "";
};

export const createLandingCtaAction = async (
  section: LandingSection,
  values: z.infer<typeof CtaButtonSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid landing section" };

  const validated = CtaButtonSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validatePublishedCtaLimit(
    sectionResult.data,
    validated.data.published
  );
  if (limitError) return { error: limitError };

  try {
    await createLandingCta(sectionResult.data, validated.data);
    await logLandingActivity("Landing CTA added", auth.user.name, auth.user.role);
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA added" };
  } catch {
    return { error: "Could not add CTA" };
  }
};

export const updateLandingCtaAction = async (
  section: LandingSection,
  id: string,
  values: z.infer<typeof CtaButtonSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid landing section" };

  const validated = CtaButtonSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validatePublishedCtaLimit(
    sectionResult.data,
    validated.data.published,
    id
  );
  if (limitError) return { error: limitError };

  try {
    await updateLandingCta(sectionResult.data, id, validated.data);
    await logLandingActivity(
      "Landing CTA updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA updated" };
  } catch {
    return { error: "Could not update CTA" };
  }
};

export const deleteLandingCtaAction = async (
  section: LandingSection,
  id: string
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid landing section" };

  try {
    await deleteLandingCta(sectionResult.data, id);
    await logLandingActivity(
      "Landing CTA deleted",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA deleted" };
  } catch {
    return { error: "Could not delete CTA" };
  }
};

export const reorderLandingCtasAction = async (
  section: LandingSection,
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid landing section" };

  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingCtas(sectionResult.data, validated.data);
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA order updated" };
  } catch {
    return { error: "Could not update CTA order" };
  }
};
