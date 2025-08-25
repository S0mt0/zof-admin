import * as z from "zod";

export const BlogFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  excerpt: z
    .string()
    .min(20, { message: "Excerpt must be at least 20 characters" })
    .max(300, { message: "Excerpt must not exceed 300 characters" }),
  content: z.string().min(1, { message: "Content is required" }),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  bannerImage: z.string().optional(),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().optional(),
});
