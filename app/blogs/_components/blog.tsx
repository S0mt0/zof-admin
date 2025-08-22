"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BlogFilters } from "./blog-filters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@radix-ui/react-checkbox";
import { TableContent } from "./table-content";
import { Pagination } from "@/components/ui/pagination-v2";

export function Blogs({ blogs, pagination, searchParams }: BlogsTableProps) {
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
    <div>
      <BlogFilters
        searchParams={searchParams}
        selectedCount={selectedBlogs.length}
        onBulkDelete={handleBulkDelete}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            Manage your blog posts, edit content, and track performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Blod table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allCurrentSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someCurrentSelected && !allCurrentSelected;
                    }}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableContent
              blogs={blogs}
              selectedBlogs={selectedBlogs}
              onSelectBlog={handleSelectBlog}
              onViewBlog={handleViewBlog}
              onEditBlog={handleEditBlog}
              onDeleteBlog={handleDeleteBlog}
            />
          </Table>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            showingStart={(pagination.page - 1) * pagination.limit + 1}
            showingEnd={Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}
            totalItems={pagination.total}
            itemName="posts"
          />
        </CardContent>
      </Card>
    </div>
  );
}
