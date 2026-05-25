import * as z from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const TeamMemberSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  role: z.string().trim().min(1, { message: "Role is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: optionalText,
  bio: optionalText,
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  avatar: optionalText,
  joinDate: z.string().min(1),
  department: optionalText,
  location: optionalText,
  skills: z.array(z.string()).default([]),
  facebook: optionalText,
  x: optionalText,
  instagram: optionalText,
  youtube: optionalText,
  linkedin: optionalText,
  tiktok: optionalText,
  threads: optionalText,
  whatsapp: optionalText,
  telegram: optionalText,
  snapchat: optionalText,
  pinterest: optionalText,
  medium: optionalText,
  twitter: optionalText,
  github: optionalText,
});

export const VolunteerSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  volunteerType: z
    .string()
    .trim()
    .min(1, { message: "Volunteer type is required" }),
  featured: z.boolean().default(false),
  avatar: optionalText,
  facebook: optionalText,
  x: optionalText,
  instagram: optionalText,
  youtube: optionalText,
  linkedin: optionalText,
  tiktok: optionalText,
  threads: optionalText,
  whatsapp: optionalText,
  telegram: optionalText,
  snapchat: optionalText,
  pinterest: optionalText,
  medium: optionalText,
});
