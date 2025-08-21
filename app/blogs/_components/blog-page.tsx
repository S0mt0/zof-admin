"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { BlogFilters } from "./blog-filters";
import { BlogTable } from "./blog-table";
import { BlogStats } from "./blog-stats";

export function BlogPage({ blogs, pagination, searchParams }: BlogPageProps) {
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

  const handleBulkDelete = () => {
    if (selectedBlogs.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog post(s)?`
      )
    ) {
      console.log("Bulk deleting blogs:", selectedBlogs);
      setSelectedBlogs([]);
      // Add actual bulk delete logic here
    }
  };

  const handleViewBlog = (blog: Blog) => {
    router.push(`/blogs/${blog.id}/view`);
  };

  const handleEditBlog = (blog: Blog) => {
    router.push(`/blogs/${blog.id}/edit`);
  };

  const handleDeleteBlog = (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      console.log("Deleting blog:", blogId);
    }
  };

  const allCurrentSelected =
    blogs.length > 0 && blogs.every((blog) => selectedBlogs.includes(blog.id));

  const someCurrentSelected = blogs.some((blog) =>
    selectedBlogs.includes(blog.id)
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Blog Posts"
        breadcrumbs={[{ label: "Blog Posts" }]}
      />

      <BlogStats blogs={blogs} />

      <BlogFilters
        searchParams={searchParams}
        selectedCount={selectedBlogs.length}
        onBulkDelete={handleBulkDelete}
        onCreateNew={() => router.push("/blogs/new")}
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
