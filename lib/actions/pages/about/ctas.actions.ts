"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createAboutCta,
  deleteAboutCta,
  getAboutPageData,
  reorderAboutCtas,
  updateAboutCta,
} from "@/lib/db/repository/pages";
import { CtaButtonSchema } from "@/lib/schemas";

import { getAuthorizedUser, IdsSchema } from "../shared";
import { logAboutActivity, sectionPath } from "./shared";

const CtaSectionSchema = z.enum(["foundersMessage", "cta"]);

const getCtaSectionPath = (section: AboutCtaSection) =>
  sectionPath(section === "foundersMessage" ? "founder-message" : section);

const validatePublishedCtaLimit = async (
  section: AboutCtaSection,
  published: boolean,
  currentId?: string
) => {
  if (!published) return "";

  const page = await getAboutPageData();
  const ctas = ((page[section] as { ctas?: CtaButtonContent[] }).ctas || [])
    .filter((cta) => cta.published)
    .filter((cta) => cta.id !== currentId);

  return ctas.length >= 2 ? "Only 2 CTA buttons can be published at once" : "";
};

export const createAboutCtaAction = async (
  section: AboutCtaSection,
  values: z.infer<typeof CtaButtonSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid about section" };

  const validated = CtaButtonSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validatePublishedCtaLimit(
    sectionResult.data,
    validated.data.published
  );
  if (limitError) return { error: limitError };

  try {
    await createAboutCta(sectionResult.data, validated.data);
    await logAboutActivity("About CTA added", auth.user.name, auth.user.role);
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA added" };
  } catch {
    return { error: "Could not add CTA" };
  }
};

export const updateAboutCtaButtonAction = async (
  section: AboutCtaSection,
  id: string,
  values: z.infer<typeof CtaButtonSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid about section" };

  const validated = CtaButtonSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validatePublishedCtaLimit(
    sectionResult.data,
    validated.data.published,
    id
  );
  if (limitError) return { error: limitError };

  try {
    await updateAboutCta(sectionResult.data, id, validated.data);
    await logAboutActivity("About CTA updated", auth.user.name, auth.user.role);
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA updated" };
  } catch {
    return { error: "Could not update CTA" };
  }
};

export const deleteAboutCtaAction = async (
  section: AboutCtaSection,
  id: string
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid about section" };

  try {
    await deleteAboutCta(sectionResult.data, id);
    await logAboutActivity("About CTA deleted", auth.user.name, auth.user.role);
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA deleted" };
  } catch {
    return { error: "Could not delete CTA" };
  }
};

export const reorderAboutCtasAction = async (
  section: AboutCtaSection,
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const sectionResult = CtaSectionSchema.safeParse(section);
  if (!sectionResult.success) return { error: "Invalid about section" };

  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderAboutCtas(sectionResult.data, validated.data);
    revalidatePath(getCtaSectionPath(sectionResult.data));
    return { success: "CTA order updated" };
  } catch {
    return { error: "Could not update CTA order" };
  }
};
