import * as z from "zod";

export const FoundationInfoSchema = z.object({
  name: z.string().min(1, { message: "Foundation name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const WebsiteSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  blogComments: z.boolean(),
  eventRegistration: z.boolean(),
});
