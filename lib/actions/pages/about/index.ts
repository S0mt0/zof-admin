"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { addAppActivity } from "@/lib/db/repository/app-activity.service";
import { upsertAboutPage } from "@/lib/db/repository/pages";
import { AboutPageSchema } from "@/lib/schemas";

import { getAuthorizedUser } from "../shared";

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
  } catch {
    return { error: "Could not update about page" };
  }
};
