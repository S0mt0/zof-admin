"use client";

import { BlogFilters } from "./blog-filters";
import BlogEmptyState from "./blog-empty-state";
import { BlogTable } from "./blog-table";
import { useReadBlogs } from "@/lib/hooks";

export function Blogs({ blogs, pagination, searchParams }: BlogsTableProps) {
  const {
    handleBulkDelete,
    handleDeleteBlog,
    handleEditBlog,
    handleSelectAll,
    handleSelectBlog,
    handleViewBlog,
    allCurrentSelected,
    selectedBlogs,
    someCurrentSelected,
  } = useReadBlogs(blogs);

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
