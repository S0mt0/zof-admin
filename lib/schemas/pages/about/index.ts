import * as z from "zod";

import { optionalText, SectionIntroSchema } from "../shared";

export const AboutHeroSectionSchema = z.object({
  intro: SectionIntroSchema,
  image: optionalText,
  mission: z.string().trim().min(1, { message: "Mission is required" }),
  vision: z.string().trim().min(1, { message: "Vision is required" }),
  calloutTitle: optionalText,
  calloutText: optionalText,
  heroBackgroundColor: optionalText,
  calloutBackgroundColor: optionalText,
});

export const AboutStorySectionSchema = z.object({
  intro: SectionIntroSchema,
  body: z.string().trim().min(1, { message: "Story body is required" }),
  image: optionalText,
  captionTitle: optionalText,
  captionText: optionalText,
  trustPoints: z.array(z.string().trim().min(1)).default([]),
});

export const AboutTeamSectionSchema = z.object({
  intro: SectionIntroSchema,
});

export const AboutFoundersMessageSectionSchema = z.object({
  intro: SectionIntroSchema,
  quote: z.string().trim().min(1, { message: "Quote is required" }),
  body: z.string().trim().min(1, { message: "Message body is required" }),
  image: optionalText,
});

export const AboutCtaSectionSchema = z.object({
  intro: SectionIntroSchema,
  backgroundImage: optionalText,
});
