import * as z from "zod";

import { optionalText } from "../shared";

export const SectionCardItemSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required" })
    .max(32, { message: "Subject must be 32 characters or less" }),
  kicker: z
    .string()
    .trim()
    .max(28, { message: "Kicker must be 28 characters or less" })
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(150, { message: "Description must be 150 characters or less" }),
  published: z.boolean().default(true),
});

export const LandingStatItemSchema = z.object({
  value: z.string().trim().min(1, { message: "Stat number is required" }),
  title: z.string().trim().min(1, { message: "Title is required" }),
  published: z.boolean().default(true),
});

export const FaqItemSchema = z.object({
  question: z.string().trim().min(1, { message: "Question is required" }),
  answer: z.string().trim().min(1, { message: "Answer is required" }),
  published: z.boolean().default(true),
});

export const TestimonialSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  role: optionalText,
  quote: z.string().trim().min(1, { message: "Testimonial is required" }),
  avatar: optionalText,
  published: z.boolean().default(true),
});

export const CtaButtonSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, { message: "CTA label is required" })
    .max(42, { message: "CTA label must be 42 characters or less" }),
  href: z
    .string()
    .trim()
    .min(1, { message: "CTA link is required" })
    .max(180, { message: "CTA link must be 180 characters or less" }),
  variant: z.enum(["primary", "secondary"]).default("primary"),
  published: z.boolean().default(true),
});
