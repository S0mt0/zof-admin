"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createUserActivity,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteManyBlogs,
} from "../db/repository";

export const createBlogAction = async (data: any, userId: string) => {
  // console.log({ data });

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

      console.log({ created });

      revalidatePath("/blogs");
      return { success: "Blog created", data: created };
    }
    redirect("/blogs");
  } catch (e) {
    console.log(e);
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
      revalidatePath("/blogs");
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
    revalidatePath("/blogs");
    return { success: "Blog deleted" };
  } catch (e) {
    return { error: "Failed to delete blog" };
  }
};

export const bulkDeleteBlogsAction = async (ids: string[], userId: string) => {
  try {
    // const existing = await (async () => {
    //   try {
    //     const blogs = await Promise.all(
    //       ids.map((id) =>
    //         (async () => {
    //           try {
    //             return await (
    //               await import("../db/repository/blog.service")
    //             ).getBlogById(id);
    //           } catch {
    //             return null;
    //           }
    //         })()
    //       )
    //     );
    //     return blogs.filter(Boolean);
    //   } catch {
    //     return [];
    //   }
    // })();

    await deleteManyBlogs(ids);

    await createUserActivity(
      userId,
      "Multiple blog posts deleted",
      `${ids.length} blog posts removed`
    );

    revalidatePath("/blogs");
    return { success: `${ids.length} blogs deleted` };
  } catch (e) {
    return { error: "Failed to delete blogs" };
  }
};
