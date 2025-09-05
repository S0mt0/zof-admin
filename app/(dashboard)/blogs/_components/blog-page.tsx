"use client";

import { BlogFilters } from "./blog-filters";
import BlogEmptyState from "./blog-empty-state";
import { BlogTable } from "./blog-table";
import { useReadBlogs } from "@/lib/hooks";
import { AlertDialog } from "@/components/alert-dialog";

export function Blogs({ data, pagination, searchParams }: BlogsTableProps) {
  const {
    handleBulkDelete,
    handleDeleteBlog,
    handleEditBlog,
    handleSelectAll,
    handleSelectBlog,
    handleViewBlog,
    toggleDialog,
    setActionType,
    setTargetId,
    allCurrentSelected,
    selectedBlogs,
    someCurrentSelected,
    isPending,
    openDialog,
    actionType,
    targetId,
  } = useReadBlogs(data);

  const dialogMessage =
    actionType === "bulk"
      ? `Do you really want to delete ${selectedBlogs.length} blog post(s)?`
      : "Are you sure you want to delete this blog post?";

  if (data.length === 0) {
    return (
      <div>
        <BlogFilters
          searchParams={searchParams}
          selectedCount={selectedBlogs.length}
          onBulkDelete={() => {}} // Note that this won't be called since there are zero selected items to be deleted
          isPending={isPending}
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
        onBulkDelete={() => {
          setActionType("bulk");
          toggleDialog();
        }}
        isPending={isPending}
      />

      <BlogTable
        data={data}
        selectedBlogs={selectedBlogs}
        onSelectBlog={handleSelectBlog}
        onSelectAll={handleSelectAll}
        onViewBlog={handleViewBlog}
        onEditBlog={handleEditBlog}
        onDeleteBlog={(id) => {
          setActionType("single");
          setTargetId(id);
          toggleDialog();
        }}
        allCurrentSelected={allCurrentSelected}
        someCurrentSelected={someCurrentSelected}
        pagination={pagination}
        searchParams={searchParams}
        isPending={isPending}
      />

      <AlertDialog
        isOpen={openDialog}
        onCancel={toggleDialog}
        onOk={() => {
          if (actionType === "bulk") return handleBulkDelete();
          if (actionType === "single" && targetId)
            return handleDeleteBlog(targetId);
        }}
        message={dialogMessage}
      />
    </div>
  );
}
