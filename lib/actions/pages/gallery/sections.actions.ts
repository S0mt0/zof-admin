"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  updateGalleryArchiveContent,
  updateGalleryHeroContent,
} from "@/lib/db/repository/pages/gallery";
import {
  GalleryArchiveSectionSchema,
  GalleryHeroSectionSchema,
} from "@/lib/schemas";

import { getAuthorizedUser } from "../shared";
import { logGalleryActivity, sectionPath } from "./shared";

export const updateGalleryHeroAction = async (
  values: z.infer<typeof GalleryHeroSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = GalleryHeroSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateGalleryHeroContent(validated.data);
    await logGalleryActivity("Gallery hero updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("hero"));
    return { success: "Hero section updated" };
  } catch {
    return { error: "Could not update hero section" };
  }
};

export const updateGalleryArchiveAction = async (
  values: z.infer<typeof GalleryArchiveSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = GalleryArchiveSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateGalleryArchiveContent(validated.data);
    await logGalleryActivity("Gallery archive intro updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("archive"));
    return { success: "Archive intro updated" };
  } catch {
    return { error: "Could not update archive intro" };
  }
};
