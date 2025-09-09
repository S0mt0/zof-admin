import * as z from "zod";

import { BlogCommentSchema, EventCommentSchema } from "@/lib/schemas/comments.";
import { db } from "../config";

export const createBlogComment = async (
  data: z.infer<typeof BlogCommentSchema>
) => {
  try {
    return (await db.blogComment.create({
      data,
    })) as IBlogComment;
  } catch (e) {
    return null;
  }
};

export const createEventComment = async (
  data: z.infer<typeof EventCommentSchema>
) => {
  try {
    return (await db.eventComment.create({
      data,
    })) as IEventComment;
  } catch (e) {
    return null;
  }
};
