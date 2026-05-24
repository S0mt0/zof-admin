"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  updateAboutCtaSettings,
  updateAboutFoundersMessageSettings,
  updateAboutHeroSettings,
  updateAboutStorySettings,
  updateAboutTeamSettings,
} from "@/lib/db/repository/pages";
import {
  AboutCtaSectionSchema,
  AboutFoundersMessageSectionSchema,
  AboutHeroSectionSchema,
  AboutStorySectionSchema,
  AboutTeamSectionSchema,
} from "@/lib/schemas";

import { getAuthorizedUser } from "../shared";
import { logAboutActivity, sectionPath } from "./shared";

export const updateAboutHeroAction = async (
  values: z.infer<typeof AboutHeroSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutHeroSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateAboutHeroSettings(validated.data);
    await logAboutActivity("About hero updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("hero"));
    return { success: "Hero section updated" };
  } catch {
    return { error: "Could not update hero section" };
  }
};

export const updateAboutStoryAction = async (
  values: z.infer<typeof AboutStorySectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutStorySectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateAboutStorySettings(validated.data);
    await logAboutActivity("About story updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("story"));
    return { success: "Story section updated" };
  } catch {
    return { error: "Could not update story section" };
  }
};

export const updateAboutTeamAction = async (
  values: z.infer<typeof AboutTeamSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutTeamSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateAboutTeamSettings(validated.data);
    await logAboutActivity("About team updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("team"));
    return { success: "Team section updated" };
  } catch {
    return { error: "Could not update team section" };
  }
};

export const updateAboutFoundersMessageAction = async (
  values: z.infer<typeof AboutFoundersMessageSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutFoundersMessageSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateAboutFoundersMessageSettings(validated.data);
    await logAboutActivity(
      "About founder message updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("founder-message"));
    return { success: "Founder message updated" };
  } catch {
    return { error: "Could not update founder message" };
  }
};

export const updateAboutCtaAction = async (
  values: z.infer<typeof AboutCtaSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutCtaSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateAboutCtaSettings(validated.data);
    await logAboutActivity("About CTA updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("cta"));
    return { success: "CTA section updated" };
  } catch {
    return { error: "Could not update CTA section" };
  }
};
