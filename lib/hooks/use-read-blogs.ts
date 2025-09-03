import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { bulkDeleteBlogsAction, deleteBlogAction } from "../actions/blogs";
import { EDITORIAL_ROLES } from "../constants";
import { useCurrentUser } from "./use-current-user";

export const useReadBlogs = (blogs: Omit<Blog, "comments">[]) => {
  const [isPending, startTransition] = useTransition();
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const router = useRouter();
  const user = useCurrentUser();

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    const currentBlogIds = blogs.map((blog) => blog.id);
    const allCurrentSelected = currentBlogIds.every((id) =>
      selectedBlogs.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedBlogs((prev) =>
        prev.filter((id) => !currentBlogIds.includes(id))
      );
    } else {
      setSelectedBlogs((prev) => [...new Set([...prev, ...currentBlogIds])]);
    }
  };

  const handleBulkDelete = () => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    if (selectedBlogs.length === 0) return;

    if (selectedBlogs.length === 1) return handleDeleteBlog(selectedBlogs[0]);

    if (
      confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`
      )
    ) {
      const loading = toast.loading("Please wait...");

      startTransition(() => {
        bulkDeleteBlogsAction(selectedBlogs)
          .then((result) => {
            if (result.success) {
              toast.success(result.success);
              setSelectedBlogs([]);
            } else {
              toast.error(result.error);
            }
          })
          .catch((e) => {
            toast.error("Failed to delete blogs");
          })
          .finally(() => {
            toast.dismiss(loading);
          });
      });
    }
  };

  const handleDeleteBlog = (blogId: string) => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    if (confirm("Are you sure you want to delete this blog post?")) {
      const loading = toast.loading("Please wait...");

      startTransition(() => {
        deleteBlogAction(blogId)
          .then((result) => {
            if (result.success) {
              toast.success(result.success);
              setSelectedBlogs([]);
            } else {
              toast.error(result.error);
            }
          })
          .catch((e) => {
            toast.error("Failed to delete blog");
          })
          .finally(() => {
            toast.dismiss(loading);
          });
      });
    }
  };

  const allCurrentSelected =
    blogs.length > 0 && blogs.every((blog) => selectedBlogs.includes(blog.id));

  const someCurrentSelected = blogs.some((blog) =>
    selectedBlogs.includes(blog.id)
  );

  const handleViewBlog = (blog: Blog) => {
    router.push(`/blogs/${blog.slug}`);
  };

  const handleEditBlog = (blog: Blog) => {
    router.push(`/blogs/${blog.slug}/edit`);
  };

  return {
    selectedBlogs,
    allCurrentSelected,
    someCurrentSelected,
    isPending,
    handleSelectBlog,
    handleSelectAll,
    handleBulkDelete,
    handleDeleteBlog,
    handleViewBlog,
    handleEditBlog,
  };
};
