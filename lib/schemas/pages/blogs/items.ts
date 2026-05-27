import * as z from "zod";

export const BlogFormSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  excerpt: z
    .string()
    .max(300, { message: "Excerpt must not exceed 300 characters" })
    .optional(),
  content: z
    .string({ message: "Content is required" })
    .min(100, { message: "Content must not be less than 100 characters" }),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  bannerImage: z
    .string()
    .url({ message: "Please upload a banner image for your blog post" }),
  caption: z
    .string()
    .max(240, { message: "Caption must not exceed 240 characters" })
    .optional(),
  featured: z.boolean().default(false),
  tags: z
    .array(z.string())
    .min(1, { message: "Add at least one tag to help categorize your blog" }),
  publishedAt: z.date().optional(),
});
