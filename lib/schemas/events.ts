import * as z from "zod";

export const EventFormSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(300, { message: "Description must not exceed 300 characters" }),
  content: z
    .string({ message: "Content is required" })
    .min(100, { message: "Content must not be less than 100 characters" }),
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
  ticketPrice: z.number().optional(),
  registrationRequired: z.boolean().default(false),
});
