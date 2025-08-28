import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { bulkDeleteBlogsAction, deleteBlogAction } from "../actions/blogs";

export const useReadBlogs = (blogs: Omit<Blog, "comments">[]) => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const router = useRouter();

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

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`
      )
    ) {
      const loading = toast.loading("Please wait...");
      try {
        const result = await bulkDeleteBlogsAction(selectedBlogs);
        if (result.success) {
          toast.success(result.success);
          setSelectedBlogs([]);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete blogs");
      } finally {
        toast.dismiss(loading);
      }
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const loading = toast.loading("Please wait...");
      try {
        const result = await deleteBlogAction(blogId);
        if (result.success) {
          toast.success(result.success);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete blog");
      } finally {
        toast.dismiss(loading);
      }
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
    handleSelectBlog,
    handleSelectAll,
    handleBulkDelete,
    handleDeleteBlog,
    handleViewBlog,
    handleEditBlog,
  };
};
