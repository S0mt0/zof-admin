import * as z from "zod";

export const DonationCampaignSchema = z.object({
  topic: z.string().trim().min(2, "Campaign topic is required").max(80, "Topic must be 80 characters or less"),
  description: z.string().trim().max(180, "Description must be 180 characters or less").optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export const DonationCurrencySchema = z.enum(["NGN", "USD"]);

export const DonationInitializeSchema = z.object({
  donor: z.string().trim().min(2, "Full name is required").max(80),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  amount: z.coerce.number().min(1, "Donation amount is required"),
  currency: DonationCurrencySchema.default("NGN"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  frequency: z.enum(["once", "monthly"]).default("once"),
  anonymous: z.boolean().default(false),
  sendReceipt: z.boolean().default(true),
  sendThankYou: z.boolean().default(true),
  campaignId: z.string().trim().optional().or(z.literal("")),
});

export const DonationStatusSchema = z.enum(["pending", "completed", "failed", "refunded", "cancelled"]);
