"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination-v2";
import { TableContent } from "./table-content";

export function BlogTable({
  data: blogs,
  selectedBlogs,
  onSelectBlog,
  onSelectAll,
  onViewBlog,
  onEditBlog,
  onDeleteBlog,
  allCurrentSelected,
  someCurrentSelected,
  pagination,
  isPending,
}: BlogTableWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Blog Posts</CardTitle>
        <CardDescription>
          Manage your blog posts, edit content, and track performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allCurrentSelected}
                  onCheckedChange={onSelectAll}
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
              <TableHead className="hidden lg:table-cell">Author</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableContent
            blogs={blogs}
            selectedBlogs={selectedBlogs}
            onSelectBlog={onSelectBlog}
            onViewBlog={onViewBlog}
            onEditBlog={onEditBlog}
            onDeleteBlog={onDeleteBlog}
            isPending={isPending}
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
          limit={pagination.limit}
        />
      </CardContent>
    </Card>
  );
}
