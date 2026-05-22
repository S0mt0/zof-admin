import * as z from "zod";

export const AboutPageSchema = z.object({
  aboutUs: z.string().trim().min(1, { message: "About us is required" }),
  vision: z.string().trim().min(1, { message: "Vision is required" }),
  mission: z.string().trim().min(1, { message: "Mission is required" }),
});
