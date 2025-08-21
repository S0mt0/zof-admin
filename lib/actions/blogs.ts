"use server";

import { revalidateTag } from "next/cache";
import {
  createUserActivity,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../db/repository";

export const createBlogAction = async (data: any, userId: string) => {
  try {
    const created = await createBlog({
      ...data,
      authorId: userId,
      createdBy: userId,
    });
    if (created) {
      await createUserActivity(
        userId,
        "New blog post published",
        created.title
      );
      revalidateTag("blogs");
    }
    return { success: "Blog created", data: created };
  } catch (e) {
    return { error: "Failed to create blog" };
  }
};

export const updateBlogAction = async (
  id: string,
  data: any,
  userId: string
) => {
  try {
    const updated = await updateBlog(id, data);
    if (updated) {
      await createUserActivity(userId, "Blog post updated", updated.title);
      revalidateTag("blogs");
    }
    return { success: "Blog updated", data: updated };
  } catch (e) {
    return { error: "Failed to update blog" };
  }
};

export const deleteBlogAction = async (id: string, userId: string) => {
  try {
    const existing = await (async () => {
      // lightweight fetch of title for activity message
      try {
        const blog = await (
          await import("../db/repository/blog.service")
        ).getBlogById(id);
        return blog;
      } catch {
        return null;
      }
    })();

    await deleteBlog(id);

    await createUserActivity(
      userId,
      "Blog post deleted",
      existing?.title || "Blog removed"
    );
    revalidateTag("blogs");
    return { success: "Blog deleted" };
  } catch (e) {
    return { error: "Failed to delete blog" };
  }
};
