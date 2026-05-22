import * as z from "zod";

export const optionalText = z.string().trim().optional().or(z.literal(""));

export const SectionIntroSchema = z.object({
  eyebrow: z.string().trim().default(""),
  heading: z
    .string()
    .trim()
    .min(1, { message: "Heading is required" })
    .max(120, { message: "Heading must be 120 characters or less" }),
  description: z
    .string()
    .trim()
    .max(280, { message: "Description must be 280 characters or less" })
    .default(""),
});
