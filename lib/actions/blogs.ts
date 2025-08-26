"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import {
  createUserActivity,
  createBlog,
  deleteBlog,
  deleteManyBlogs,
  updateBlogBySlug,
} from "../db/repository";
import { capitalize, currentUser } from "../utils";
import { MailService } from "../utils/mail.service";

export const createBlogAction = async (data: Partial<Blog>) => {
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
        user.id!,
        "New blog post created",
        newBlog.title
      );

      revalidateTag("app-stats");
      revalidateTag("profile-stats");
      revalidatePath("/blogs");
      return { success: "Blog created" };
    }
  } catch (e: any) {
    console.log({ e });
    return { error: "Failed to create blog" };
  }
};

export const updateBlogAction = async (slug: string, data: Partial<Blog>) => {
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
        error:
          "Permission denied. Only admins or editors can update this blog post.",
      };

    const updated = await updateBlogBySlug(slug, data);
    if (updated) {
      await createUserActivity(user.id, "Blog post updated", updated.title);

      if (
        updated.createdBy !== user.id &&
        updated.author?.email &&
        updated.author.emailNotifications
      ) {
        const mailer = new MailService();
        await mailer.sendBlogUpdateEmail(user as any, updated);

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

      revalidateTag("app-stats");
      revalidateTag("profile-stats");
      revalidatePath("/blogs");
    }
    return { success: "Blog post updated" };
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
        error:
          "Permission denied. Only admins or editors can delete this blog post.",
      };

    const deleted = await deleteBlog(blog.id);

    if (deleted) {
      await createUserActivity(
        user.id,
        "Blog post deleted",
        capitalize(deleted.title)
      );

      if (
        deleted.createdBy !== user.id &&
        deleted.author?.email &&
        deleted.author.emailNotifications
      ) {
        const mailer = new MailService();
        await mailer.sendBlogDeleteEmail(user as any, deleted);

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

      revalidateTag("app-stats");
      revalidateTag("profile-stats");
      revalidatePath("/blogs");
    }

    return { success: "Blog deleted" };
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
        ).getAllUsers({ emailNotifications: true });
      })();

      const usersEmail = users
        .filter((u) => u.email !== user.email)
        .map((u) => u.email);

      if (usersEmail.length > 0) {
        const mailer = new MailService();
        await mailer.sendBlogBulkDeleteEmail(
          user as any,
          usersEmail,
          result.count
        );

        await createUserActivity(
          user.id,
          "Multiple blog posts deleted",
          `${result.count} blog posts removed`
        );
      }

      revalidateTag("app-stats");
      revalidateTag("profile-stats");
      revalidatePath("/blogs");
    }

    return { success: `${result.count} blogs deleted` };
  } catch (e) {
    return { error: "Failed to delete blogs" };
  }
};
