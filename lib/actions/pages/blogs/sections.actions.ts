"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { updateBlogsHeroSettings } from "@/lib/db/repository/pages";
import { BlogsHeroSectionSchema } from "@/lib/schemas";

import { getAuthorizedUser } from "../shared";
import { logBlogsActivity, sectionPath } from "./shared";

export const updateBlogsHeroAction = async (
  values: z.infer<typeof BlogsHeroSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = BlogsHeroSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateBlogsHeroSettings(validated.data);
    await logBlogsActivity(
      "blogs hero updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("hero"));
    return { success: "Hero section updated" };
  } catch {
    return { error: "Could not update hero section" };
  }
};
