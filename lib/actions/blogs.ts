"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as z from "zod";

import {
  addAppActivity,
  createBlog,
  deleteBlog,
  deleteManyBlogs,
  getUserById,
  updateBlogBySlug,
} from "../db/repository";
import { capitalize, currentUser } from "../utils";
import { MailService } from "../utils/mail.service";
import { BlogFormSchema } from "../schemas";
import { EDITORIAL_ROLES } from "../constants";

export const createBlogAction = async (
  data: z.infer<typeof BlogFormSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const existingBlog = await (async () => {
      try {
        const blog = await (
          await import("../db/repository/blog.service")
        ).getBlogByTitle(data.title!);

        return blog;
      } catch {
        return null;
      }
    })();

    if (existingBlog) {
      return {
        error: "A blog with the same title already exists, try again.",
      };
    }

    const newBlog = await createBlog({
      ...data,
      authorId: user.id,
      createdBy: user.id,
    });

    if (newBlog) {
      await addAppActivity(
        "New blog post added",
        `${capitalize(
          user.name!
        )} just added a new blog post, titled "${capitalize(newBlog.title)}"`
      );

      revalidateTag("blog");
      return { success: "Blog post created", data: { blog: newBlog } };
    }
  } catch (e: any) {
    console.log({ e });
    return { error: "Failed to create blog" };
  }
};

export const updateBlogAction = async (
  slug: string,
  data: z.infer<typeof BlogFormSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const blog = await (async () => {
      try {
        const blog = await (
          await import("../db/repository/blog.service")
        ).getBlogBySlug(slug);

        return blog;
      } catch {
        return null;
      }
    })();

    if (!blog) return { error: "Blog post not found" };

    const updated = await updateBlogBySlug(slug, data);

    if (updated) {
      await addAppActivity(
        "Blog post updated",
        `${user.name} (${
          user.role
        }) made some changes to the blog post, titled "${capitalize(
          blog.title
        )}"`
      );

      revalidateTag("blog");
    }
    return { success: "Blog post updated", data: { blog: updated } };
  } catch (e) {
    return { error: "Failed to update blog" };
  }
};

export const deleteBlogAction = async (id: string) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const blog = await (async () => {
      try {
        const blog = await (
          await import("../db/repository/blog.service")
        ).getBlogById(id);

        return blog;
      } catch {
        return null;
      }
    })();

    if (!blog) return { error: "Blog post does not exist" };

    const deleted = await deleteBlog(blog.id);

    if (deleted) {
      await addAppActivity(
        "Blog post deleted",
        `${user.name} (${
          user.role
        }) deleted the blog post, titled "${capitalize(deleted.title)}"`
      );

      if (
        deleted.createdBy !== user.id &&
        deleted.author?.email &&
        deleted?.author?.emailNotifications
      ) {
        const mailer = new MailService();
        await mailer.sendBlogDeleteEmail(user as any, deleted as any);
      }

      revalidateTag("blog");
    }

    return { success: "Blog post deleted successfully" };
  } catch (e) {
    return { error: "Failed to delete blog" };
  }
};

export const bulkDeleteBlogsAction = async (ids: string[]) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const result = await deleteManyBlogs(ids);
    if (!result) return { error: "No blogs were deleted." };

    await addAppActivity(
      "Blog post(s) deleted",
      `${user.name} (${user.role}) deleted ${result.count} blog post(s)"`
    );

    revalidateTag("blog");

    return { success: `${result.count} blog(s) deleted successfully` };
  } catch (e) {
    return { error: "Failed to delete blogs" };
  }
};
