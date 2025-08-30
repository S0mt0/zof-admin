"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { format } from "date-fns";
import * as z from "zod";

import {
  createUserActivity,
  createBlog,
  deleteBlog,
  deleteManyBlogs,
  updateBlogBySlug,
} from "../db/repository";
import { capitalize, currentUser } from "../utils";
import { MailService } from "../utils/mail.service";
import { db } from "../db/config";
import { BlogFormSchema } from "../schemas";

export const createBlogAction = async (
  data: z.infer<typeof BlogFormSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

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

    if (existingBlog)
      return {
        error: "A blog with the same title already exists, try again.",
      };

    const newBlog = await createBlog({
      ...data,
      authorId: user.id,
      createdBy: user.id,
    });

    if (newBlog) {
      await createUserActivity(
        user.id,
        "New blog post created",
        capitalize(newBlog.title)
      );

      revalidateTag("profile-stats");
      revalidatePath("/blogs");
      revalidatePath("/");
      revalidateTag("blog");
      return { success: "Blog created", data: { blog: newBlog } };
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
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

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

    if (
      blog.createdBy !== user.id &&
      user.role !== "admin" &&
      user.role !== "editor"
    )
      return {
        error: "Permission denied.",
      };

    const updated = await updateBlogBySlug(slug, data);
    if (updated) {
      await createUserActivity(
        user.id,
        "Blog post updated",
        `Title: "${capitalize(updated.title)}"`
      );

      if (updated.createdBy !== user.id && updated?.author?.email) {
        if (updated?.author?.emailNotifications) {
          const mailer = new MailService();
          await mailer.sendBlogUpdateEmail(user as any, updated as any);
        }

        await createUserActivity(
          updated?.authorId!,
          "Blog post updated",
          `Your blog post titled "${updated.title}" was updated by ${
            user.role === "admin" ? "an administrator" : "an editor"
          }, ${capitalize(user.name!)} on ${format(
            updated.updatedAt,
            "EEEE, MMMM d, yyyy 'at' h:mmaaa"
          )}.`
        );
      }

      revalidateTag("profile-stats");
      revalidateTag("blog");
      revalidatePath("/blogs");
      revalidatePath("/");
    }
    return { success: "Blog post updated", data: { blog: updated } };
  } catch (e) {
    return { error: "Failed to update blog" };
  }
};

export const deleteBlogAction = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

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

    if (
      blog.createdBy !== user.id &&
      user.role !== "admin" &&
      user.role !== "editor"
    )
      return {
        error: "Permission denied.",
      };

    const deleted = await deleteBlog(blog.id);

    if (deleted) {
      await createUserActivity(
        user.id,
        "Blog post deleted",
        `Title: "${capitalize(deleted.title)}"`
      );

      if (deleted.createdBy !== user.id && deleted.author?.email) {
        if (deleted?.author?.emailNotifications) {
          const mailer = new MailService();
          await mailer.sendBlogDeleteEmail(user as any, deleted as any);
        }

        await createUserActivity(
          deleted?.authorId!,
          "Blog post deleted",
          `Your blog post titled 
        "${capitalize(deleted.title)}" was deleted by ${
            user.role === "admin" ? "an administrator" : "an editor"
          }, ${capitalize(user.name!)} on ${format(
            deleted.updatedAt,
            "EEEE, MMMM d, yyyy 'at' h:mmaaa"
          )}.`
        );
      }

      revalidateTag("profile-stats");
      revalidateTag("blog");
      revalidatePath("/blogs");
      revalidatePath("/");
    }

    return { success: "Blog post deleted successfully" };
  } catch (e) {
    return { error: "Failed to delete blog" };
  }
};

export const bulkDeleteBlogsAction = async (ids: string[]) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

  if (user.role !== "admin" && user.role !== "editor")
    return {
      error: "Permission denied.",
    };

  try {
    const result = await deleteManyBlogs(ids);
    if (!result) return { error: "No blogs were deleted." };

    if (result.count >= 5) {
      const users = await (async () => {
        return await (
          await import("../db/repository/user.service")
        ).getAllUsers();
      })();

      const bulkActivities = users
        .filter((u) => u.id !== user.id)
        .map((u) => ({
          userId: u.id,
          title: "Multiple blog posts deleted",
          description: `${result.count} blog posts were removed by ${capitalize(
            user.name!
          )}`,
        }));

      await db.userActivity.createMany({ data: bulkActivities });

      const usersToNotifyEmails = users
        .filter((u) => u.email !== user.email && u.emailNotifications)
        .map((u) => u.email);

      if (usersToNotifyEmails.length > 0) {
        const mailer = new MailService();
        await mailer.sendBlogBulkDeleteEmail(
          user as any,
          usersToNotifyEmails,
          result.count
        );
      }
    }

    revalidateTag("profile-stats");
    revalidatePath("/blogs");
    revalidatePath("/");
    revalidateTag("blog");

    return { success: `${result.count} blog(s) deleted successfully` };
  } catch (e) {
    return { error: "Failed to delete blogs" };
  }
};
