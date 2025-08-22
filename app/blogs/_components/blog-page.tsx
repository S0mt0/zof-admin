"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { BlogFilters } from "./blog-filters";
import BlogEmptyState from "./blog-empty-state";
import { BlogTable } from "./blog-table";
import { deleteBlogAction, bulkDeleteBlogsAction } from "@/lib/actions/blogs";
import { useCurrentUser } from "@/lib/hooks";

export function Blogs({ blogs, pagination, searchParams }: BlogsTableProps) {
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

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`
      )
    ) {
      try {
        const result = await bulkDeleteBlogsAction(selectedBlogs, user?.id!);
        if (result.success) {
          toast.success(result.success);
          setSelectedBlogs([]);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete blogs");
      }
    }
  };

  const handleViewBlog = (blog: Blog) => {
    router.push(`/blogs/${blog.id}/view`);
  };

  const handleEditBlog = (blog: Blog) => {
    router.push(`/blogs/${blog.id}/edit`);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const result = await deleteBlogAction(blogId, user?.id!);
        if (result.success) {
          toast.success(result.success);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete blog");
      }
    }
  };

  const allCurrentSelected =
    blogs.length > 0 && blogs.every((blog) => selectedBlogs.includes(blog.id));

  const someCurrentSelected = blogs.some((blog) =>
    selectedBlogs.includes(blog.id)
  );

  if (blogs.length === 0) {
    return (
      <div>
        <BlogFilters
          searchParams={searchParams}
          selectedCount={selectedBlogs.length}
          onBulkDelete={handleBulkDelete}
        />
        <BlogEmptyState />
      </div>
    );
  }

  return (
    <div>
      <BlogFilters
        searchParams={searchParams}
        selectedCount={selectedBlogs.length}
        onBulkDelete={handleBulkDelete}
      />

      <BlogTable
        blogs={blogs}
        selectedBlogs={selectedBlogs}
        onSelectBlog={handleSelectBlog}
        onSelectAll={handleSelectAll}
        onViewBlog={handleViewBlog}
        onEditBlog={handleEditBlog}
        onDeleteBlog={handleDeleteBlog}
        allCurrentSelected={allCurrentSelected}
        someCurrentSelected={someCurrentSelected}
        pagination={pagination}
        searchParams={searchParams}
      />
    </div>
  );
}
