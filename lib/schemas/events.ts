import * as z from "zod";

export const EventFormSchema = z.object({
  name: z
    .string({ message: "Event name is required" })
    .min(3, { message: "Event name must be at least 3 characters" }),
  detail: z.string().optional(),
  organizer: z.string().optional(),
  excerpt: z.string().optional(),
  slug: z.string(),
  date: z
    .string({ message: "Date is required" })
    .trim()
    .min(2, { message: "Date is required" }),
  startTime: z.string({ message: "Start time is required" }),
  endTime: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  maxAttendees: z.number().optional(),
  currentAttendees: z.number().default(0),
  bannerImage: z
    .string()
    .url({ message: "Please upload a banner image for your event" }),
  status: z
    .enum(["upcoming", "draft", "completed", "cancelled", "happening"])
    .default("draft"),
  featured: z.boolean().default(false),
  tags: z
    .array(z.string())
    .min(1, { message: "Add at least one tag to help categorize your event" }),
  ticketPrice: z.string().optional(),
  registrationRequired: z.boolean().default(false),
});
