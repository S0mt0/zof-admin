import * as z from "zod";

export const EventFormSchema = z.object({
  name: z
    .string({ message: "Event name is required" })
    .min(3, { message: "Event name must be at least 3 characters" }),
  detail: z.string({ message: "Content is required" }).optional(),
  organizer: z.string().optional(),
  excerpt: z.string().optional(),
  slug: z.string(),
  date: z.date({ message: "Date is required" }),
  startTime: z.string({ message: "Start time is required" }),
  endTime: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  maxAttendees: z.number().optional(),
  currentAttendees: z.number().default(0),
  bannerImage: z
    .string()
    .url({ message: "Please upload a banner image for your event" }),
  status: z
    .enum(["upcoming", "draft", "completed", "cancelled"])
    .default("draft"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  ticketPrice: z.string().optional(),
  registrationRequired: z.boolean().default(false),
});
