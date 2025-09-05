"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Filter, Trash2 } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/lib/hooks";
import { EDITORIAL_ROLES } from "@/lib/constants";

export function BlogFilters({
  searchParams,
  selectedCount,
  onBulkDelete,
  isPending,
}: BlogFiltersProps) {
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParamsObj);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/blogs?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateSearchParams({ search: value });
  };

  const handleStatusFilter = (status: string) => {
    updateSearchParams({ status });
  };

  const handleFeaturedFilter = (featured: string) => {
    updateSearchParams({ featured });
  };

  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 800);

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Published";
      case "draft":
        return "Draft";
      case "scheduled":
        return "Scheduled";
      default:
        return "All Status";
    }
  };

  const getFeaturedLabel = (featured: string) => {
    switch (featured) {
      case "featured":
        return "Featured";
      case "not-featured":
        return "Not Featured";
      default:
        return "All Featured";
    }
  };

  const user = useCurrentUser();
  const isDisabled = !user || !EDITORIAL_ROLES.includes(user.role) || isPending;

  const dialogMessage =
    selectedCount <= 1
      ? "Are you sure you want to delete this blog post?"
      : `Do you really want to delete ${selectedCount} blog posts?`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
      <div className="flex lg:hidden relative flex-1 shrink-0 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search blog posts..."
          defaultValue={searchParams.search || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center gap-4 w-full max-w-4xl">
        <div className="hidden lg:flex relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search blog posts..."
            defaultValue={searchParams.search || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {getStatusLabel(searchParams.status || "all")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("published")}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("draft")}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("scheduled")}>
              Scheduled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {getFeaturedLabel(searchParams.featured || "all")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFeaturedFilter("all")}>
              All Featured
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeaturedFilter("featured")}>
              Featured
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFeaturedFilter("not-featured")}
            >
              Not Featured
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            onClick={onBulkDelete}
            disabled={isDisabled}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedCount})
          </Button>
        )}
        <Button onClick={() => router.push("/blogs/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Button>
      </div>
    </div>
  );
}
