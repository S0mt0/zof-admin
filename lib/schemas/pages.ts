import * as z from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const AboutPageSchema = z.object({
  aboutUs: z.string().trim().min(1, { message: "About us is required" }),
  vision: z.string().trim().min(1, { message: "Vision is required" }),
  mission: z.string().trim().min(1, { message: "Mission is required" }),
});

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
