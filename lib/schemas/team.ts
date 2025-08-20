import * as z from "zod";

export const TeamMemberSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  avatar: z.string().optional(),
  joinDate: z.string().min(1),
  department: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).default([]),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
});
