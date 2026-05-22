"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createLandingSectionCard,
  deleteLandingSectionCard,
  reorderLandingSectionCards,
  updateLandingSectionCard,
  type CardSection,
} from "@/lib/db/repository/pages";
import { SectionCardItemSchema } from "@/lib/schemas";

import {
  getAuthorizedUser,
  IdsSchema,
  logLandingActivity,
  sectionPath,
  validateCardPublishLimit,
} from "../shared";

export const createLandingCardAction = async (
  section: CardSection,
  values: z.infer<typeof SectionCardItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = SectionCardItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateCardPublishLimit(
    section,
    validated.data.published
  );
  if (limitError) return { error: limitError };

  try {
    await createLandingSectionCard(section, validated.data);
    await logLandingActivity("Landing card added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Card added" };
  } catch {
    return { error: "Could not add card" };
  }
};

export const updateLandingCardAction = async (
  section: CardSection,
  id: string,
  values: z.infer<typeof SectionCardItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = SectionCardItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateCardPublishLimit(
    section,
    validated.data.published,
    id
  );
  if (limitError) return { error: limitError };

  try {
    await updateLandingSectionCard(section, id, validated.data);
    await logLandingActivity("Landing card updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Card updated" };
  } catch {
    return { error: "Could not update card" };
  }
};

export const deleteLandingCardAction = async (
  section: CardSection,
  id: string
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteLandingSectionCard(section, id);
    await logLandingActivity("Landing card deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Card deleted" };
  } catch {
    return { error: "Could not delete card" };
  }
};

export const reorderLandingCardsAction = async (
  section: CardSection,
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingSectionCards(section, validated.data);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};
