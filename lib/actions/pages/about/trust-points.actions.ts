"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createAboutTrustPoint,
  deleteAboutTrustPoint,
  reorderAboutTrustPoints,
  updateAboutTrustPoint,
} from "@/lib/db/repository/pages";
import { AboutTrustPointSchema } from "@/lib/schemas";

import { getAuthorizedUser, IdsSchema } from "../shared";
import { logAboutActivity, sectionPath } from "./shared";

export const createAboutTrustPointAction = async (
  values: z.infer<typeof AboutTrustPointSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutTrustPointSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await createAboutTrustPoint(validated.data);
    await logAboutActivity(
      "About trust point added",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("story"));
    return { success: "Trust point added" };
  } catch {
    return { error: "Could not add trust point" };
  }
};

export const updateAboutTrustPointAction = async (
  id: string,
  values: z.infer<typeof AboutTrustPointSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutTrustPointSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateAboutTrustPoint(id, validated.data);
    await logAboutActivity(
      "About trust point updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("story"));
    return { success: "Trust point updated" };
  } catch {
    return { error: "Could not update trust point" };
  }
};

export const deleteAboutTrustPointAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteAboutTrustPoint(id);
    await logAboutActivity(
      "About trust point deleted",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("story"));
    return { success: "Trust point deleted" };
  } catch {
    return { error: "Could not delete trust point" };
  }
};

export const reorderAboutTrustPointsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderAboutTrustPoints(validated.data);
    revalidatePath(sectionPath("story"));
    return { success: "Trust point order updated" };
  } catch {
    return { error: "Could not update trust point order" };
  }
};
