import * as z from "zod";

export const BlogCommentSchema = z.object({
  comment: z.string().min(5, { message: "Comment too short" }),
  authorName: z.string().min(1, { message: "Name is required" }),
  authorEmail: z.string().email({ message: "Valid email is required" }),
  blogId: z.string().min(1, { message: "BlogId is required" }),
});

export const EventCommentSchema = z.object({
  comment: z.string().min(5, { message: "Comment too short" }),
  authorName: z.string().min(1, { message: "Name is required" }),
  authorEmail: z.string().email({ message: "Valid email is required" }),
  eventId: z.string().min(1, { message: "EventId is required" }),
});
