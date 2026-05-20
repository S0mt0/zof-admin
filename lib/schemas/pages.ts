import * as z from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const AboutPageSchema = z.object({
  aboutUs: z.string().trim().min(1, { message: "About us is required" }),
  vision: z.string().trim().min(1, { message: "Vision is required" }),
  mission: z.string().trim().min(1, { message: "Mission is required" }),
});

export const LandingFaqSchema = z.object({
  question: z.string().trim().min(1, { message: "Question is required" }),
  answer: z.string().trim().min(1, { message: "Answer is required" }),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const LandingTestimonialSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  role: optionalText,
  quote: z.string().trim().min(1, { message: "Testimonial is required" }),
  avatar: optionalText,
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const LandingStatSchema = z.object({
  value: z.string().trim().min(1, { message: "Stat number is required" }),
  title: z.string().trim().min(1, { message: "Title is required" }),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const LandingExtraSchema = z.object({
  heroImage: optionalText,
  themeVideo: optionalText,
  themeVideoPoster: optionalText,
  themeVideoFile: optionalText,
  aboutImage: optionalText,
});
