"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createLandingImpactStat,
  deleteLandingImpactStat,
  reorderLandingImpactStats,
  updateLandingImpactStat,
} from "@/lib/db/repository/pages";
import { LandingStatItemSchema } from "@/lib/schemas";

import {
  getAuthorizedUser,
  IdsSchema,
  logLandingActivity,
  sectionPath,
  validateStatPublishLimit,
} from "../shared";

export const createLandingStatAction = async (
  values: z.infer<typeof LandingStatItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = LandingStatItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateStatPublishLimit(validated.data.published);
  if (limitError) return { error: limitError };

  try {
    await createLandingImpactStat(validated.data);
    await logLandingActivity("Landing stat added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Stat added" };
  } catch {
    return { error: "Could not add stat" };
  }
};

export const updateLandingStatAction = async (
  id: string,
  values: z.infer<typeof LandingStatItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = LandingStatItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateStatPublishLimit(
    validated.data.published,
    id
  );
  if (limitError) return { error: limitError };

  try {
    await updateLandingImpactStat(id, validated.data);
    await logLandingActivity("Landing stat updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Stat updated" };
  } catch {
    return { error: "Could not update stat" };
  }
};

export const deleteLandingStatAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteLandingImpactStat(id);
    await logLandingActivity("Landing stat deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Stat deleted" };
  } catch {
    return { error: "Could not delete stat" };
  }
};

export const reorderLandingStatsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingImpactStats(validated.data);
    revalidatePath(sectionPath("impact"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};
