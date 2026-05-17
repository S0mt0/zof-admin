import * as z from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const MediaSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("photo"),
      src: z.string().url({ message: "Media file is required" }),
      srcKey: z.string().min(1, { message: "Media key is required" }),
      alt: z.string().trim().min(1, { message: "Alt text is required" }),
      caption: optionalText,
      description: optionalText,
    }),
    z.object({
      type: z.literal("video"),
      src: z.string().url({ message: "Video file is required" }),
      srcKey: z.string().min(1, { message: "Video key is required" }),
      poster: z.string().url({ message: "Poster image is required" }),
      posterKey: z.string().min(1, { message: "Poster key is required" }),
      title: z.string().trim().min(1, { message: "Title is required" }),
      caption: optionalText,
      description: optionalText,
    }),
  ])
  .transform((value) => {
    if (value.type === "photo") {
      return {
        ...value,
        caption: value.caption?.trim() || undefined,
        description: value.description?.trim() || undefined,
      };
    }

    return {
      ...value,
      caption: value.caption?.trim() || undefined,
      description: value.description?.trim() || undefined,
    };
  });
