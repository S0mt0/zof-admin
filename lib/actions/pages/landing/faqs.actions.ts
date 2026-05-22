"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createLandingFaqItem,
  deleteLandingFaqItem,
  reorderLandingFaqItems,
  updateLandingFaqItem,
} from "@/lib/db/repository/pages";
import { FaqItemSchema } from "@/lib/schemas";

import {
  getAuthorizedUser,
  IdsSchema,
  logLandingActivity,
  sectionPath,
} from "../shared";

export const createLandingFaqAction = async (
  values: z.infer<typeof FaqItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FaqItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await createLandingFaqItem(validated.data);
    await logLandingActivity("Landing FAQ added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ added" };
  } catch {
    return { error: "Could not add FAQ" };
  }
};

export const updateLandingFaqAction = async (
  id: string,
  values: z.infer<typeof FaqItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FaqItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFaqItem(id, validated.data);
    await logLandingActivity("Landing FAQ updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ updated" };
  } catch {
    return { error: "Could not update FAQ" };
  }
};

export const deleteLandingFaqAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteLandingFaqItem(id);
    await logLandingActivity("Landing FAQ deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ deleted" };
  } catch {
    return { error: "Could not delete FAQ" };
  }
};

export const reorderLandingFaqsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingFaqItems(validated.data);
    revalidatePath(sectionPath("faqs"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};
