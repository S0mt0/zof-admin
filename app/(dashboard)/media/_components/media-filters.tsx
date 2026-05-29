"use client";

import { Filter, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MediaFilters({
  searchParams,
  isPending,
  selectedCount,
  onBulkDelete,
  onOpenUpload,
}: MediaFiltersProps & {
  selectedCount: number;
  onBulkDelete: () => void;
  onOpenUpload: () => void;
}) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 800);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(currentSearchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete("page");

    const query = params.toString();
    router.push(query ? `/media/manage?${query}` : "/media/manage");
  };

  useEffect(() => {
    updateSearchParams({ search: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "photo":
        return "Photos";
      case "video":
        return "Videos";
      default:
        return "All Media";
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search media library..."
            defaultValue={searchParams.search || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {getTypeLabel(searchParams.type || "all")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => updateSearchParams({ type: "all" })}>
              All Media
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSearchParams({ type: "photo" })}>
              Photos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateSearchParams({ type: "video" })}>
              Videos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 ? (
          <Button
            variant="destructive"
            onClick={onBulkDelete}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedCount})
          </Button>
        ) : null}
        <Button onClick={onOpenUpload}>Upload Media</Button>
      </div>
    </div>
  );
}
