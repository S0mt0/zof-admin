"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  createDonationCampaign,
  deleteDonationCampaign,
  findDonationCampaignByNormalizedTopic,
  reorderDonationCampaigns,
  updateDonationCampaign,
} from "@/lib/db/repository/pages/donations";
import { DonationCampaignSchema } from "@/lib/schemas/pages/donations";
import { IdsSchema } from "../shared";

import { getAuthorizedDonationAdmin, logDonationActivity, sectionPath } from "./shared";

export const createDonationCampaignAction = async (
  values: z.infer<typeof DonationCampaignSchema>
) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  const validated = DonationCampaignSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid campaign fields" };

  try {
    const existing = await findDonationCampaignByNormalizedTopic(validated.data.topic);
    if (existing) return { error: "A campaign with this topic already exists." };

    await createDonationCampaign(validated.data);
    await logDonationActivity("Donation campaign created", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("campaigns"));
    return { success: "Campaign created" };
  } catch {
    return { error: "Could not create campaign" };
  }
};

export const updateDonationCampaignAction = async (
  id: string,
  values: z.infer<typeof DonationCampaignSchema>
) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  const validated = DonationCampaignSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid campaign fields" };

  try {
    const existing = await findDonationCampaignByNormalizedTopic(validated.data.topic, id);
    if (existing) return { error: "A campaign with this topic already exists." };

    await updateDonationCampaign(id, validated.data as any);
    await logDonationActivity("Donation campaign updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("campaigns"));
    return { success: "Campaign updated" };
  } catch {
    return { error: "Could not update campaign" };
  }
};

export const reorderDonationCampaignsAction = async (ids: string[]) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid campaign order" };

  try {
    await reorderDonationCampaigns(validated.data);
    await logDonationActivity("Donation campaigns reordered", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("campaigns"));
    return { success: "Campaign order updated" };
  } catch {
    return { error: "Could not reorder campaigns" };
  }
};

export const deleteDonationCampaignAction = async (id: string) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteDonationCampaign(id);
    await logDonationActivity("Donation campaign deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("campaigns"));
    return { success: "Campaign deleted" };
  } catch {
    return { error: "Could not delete campaign. Remove linked donations first." };
  }
};
