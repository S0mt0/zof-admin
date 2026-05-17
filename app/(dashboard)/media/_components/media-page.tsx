"use client";

import { useState } from "react";

import { AlertDialog } from "@/components/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination-v2";
import { useReadMedia } from "@/lib/hooks";
import MediaEmptyState from "./media-empty-state";
import { MediaCard } from "./media-card";
import { MediaFilters } from "./media-filters";
import { UploadMediaForm } from "./upload-media-form";

export function MediaPage({ data, pagination, searchParams }: MediaPageProps) {
  const [openUpload, setOpenUpload] = useState(false);
  const {
    actionType,
    allCurrentSelected,
    handleBulkDelete,
    handleDeleteMedia,
    handleSelectAll,
    handleSelectMedia,
    isPending,
    openDialog,
    selectedMedia,
    someCurrentSelected,
    target,
    setActionType,
    setTargetId,
    toggleDialog,
  } = useReadMedia(data);

  return (
    <div className="space-y-4">
      <MediaFilters
        searchParams={searchParams}
        isPending={isPending}
        selectedCount={selectedMedia.length}
        onBulkDelete={() => {
          setActionType("bulk");
          setTargetId(null);
          toggleDialog();
        }}
        onOpenUpload={() => setOpenUpload(true)}
      />

      {data.length === 0 ? (
        <MediaEmptyState />
      ) : (
        <Card>
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Upload, browse, and remove photos or videos used across the
                platform.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
              <Checkbox
                checked={allCurrentSelected}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  if (el) {
                    (el as HTMLInputElement).indeterminate =
                      someCurrentSelected && !allCurrentSelected;
                  }
                }}
              />
              <span>Select page</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  checked={selectedMedia.includes(item.id)}
                  isPending={isPending}
                  onCheckedChange={() => handleSelectMedia(item.id)}
                  onDelete={() => {
                    setActionType("single");
                    setTargetId(item.id);
                    toggleDialog();
                  }}
                />
              ))}
            </div>

            <Pagination
              pathname="/media"
              searchParams={searchParams}
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              showingStart={(pagination.page - 1) * pagination.limit + 1}
              showingEnd={Math.min(
                pagination.page * pagination.limit,
                pagination.total
              )}
              totalItems={pagination.total}
              itemName="items"
              limit={pagination.limit}
            />
          </CardContent>
        </Card>
      )}

      <UploadMediaForm open={openUpload} onOpenChange={setOpenUpload} />

      <AlertDialog
        isOpen={openDialog}
        onCancel={toggleDialog}
        onOk={() => {
          if (actionType === "single" && target?.id) {
            return handleDeleteMedia(target.id);
          }

          if (actionType === "bulk") {
            return handleBulkDelete();
          }
        }}
        message={
          actionType === "single" && target
            ? `Are you sure you want to delete this ${target.type} from the media library?`
            : `Are you sure you want to delete ${selectedMedia.length} media item(s)?`
        }
        isPending={isPending}
      />
    </div>
  );
}
