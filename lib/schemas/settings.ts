import * as z from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const FoundationInfoSchema = z.object({
  name: z.string().min(1, { message: "Foundation name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  description: optionalText,
  address: optionalText,
  phone: optionalText,
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

export const WebsiteSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  blogComments: z.boolean(),
  eventComments: z.boolean(),
  eventRegistration: z.boolean(),
});
