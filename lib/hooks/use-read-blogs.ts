import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { bulkDeleteBlogsAction, deleteBlogAction } from "../actions/blogs";
import { EDITORIAL_ROLES } from "../constants";
import { useCurrentUser } from "./use-current-user";

export const useReadBlogs = (blogs: Omit<Blog, "comments">[]) => {
  const [isPending, startTransition] = useTransition();
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [actionType, setActionType] = useState<"bulk" | "single" | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const user = useCurrentUser();

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const toggleDialog = () => setOpenDialog((curr) => !curr);

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
          toggleDialog();
        });
    });
  };

  const handleDeleteBlog = (blogId: string) => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    console.log("hello world...");

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
          toggleDialog();
        });
    });
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
    actionType,
    targetId,
    openDialog,
    handleSelectBlog,
    handleSelectAll,
    handleBulkDelete,
    handleDeleteBlog,
    handleViewBlog,
    handleEditBlog,
    setActionType,
    setTargetId,
    toggleDialog,
  };
};
