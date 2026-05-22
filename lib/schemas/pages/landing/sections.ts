import * as z from "zod";

import { optionalText, SectionIntroSchema } from "../shared";

export const HeroSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Hero title is required" })
    .max(120, { message: "Hero title must be 120 characters or less" }),
  subtitle: z
    .string()
    .trim()
    .min(1, { message: "Hero subtitle is required" })
    .max(260, { message: "Hero subtitle must be 260 characters or less" }),
  image: optionalText,
});

export const AboutSectionSchema = z.object({
  intro: SectionIntroSchema,
  themePhoto: optionalText,
});

export const ValuesSectionSchema = z.object({
  intro: SectionIntroSchema,
  closingText: optionalText,
  ctaLabel: optionalText,
  ctaHref: optionalText,
});

export const VolunteersSectionSchema = z.object({
  intro: SectionIntroSchema,
  featuredVolunteerId: optionalText,
  ctaHeading: optionalText,
  ctaLabel: optionalText,
  ctaHref: optionalText,
});

export const ImpactSectionSchema = z.object({
  intro: SectionIntroSchema,
  youtubeUrl: optionalText,
});

export const TestimonialsSectionSchema = z.object({
  intro: SectionIntroSchema,
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

export const FeaturedContentSectionSchema = z.object({
  intro: SectionIntroSchema,
  limit: z.coerce.number().int().min(1).max(12).default(4),
});

export const FaqSectionSchema = z.object({
  intro: SectionIntroSchema,
});
