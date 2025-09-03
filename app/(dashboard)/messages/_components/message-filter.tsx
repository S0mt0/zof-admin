"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/lib/hooks";
import { EDITORIAL_ROLES } from "@/lib/constants";

export function MessageFilters({
  searchParams,
  selectedCount,
  unreadCount,
  onBulkDelete,
}: MessageFiltersProps) {
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

    router.push(`/messages?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateSearchParams({ search: value });
  };

  const handleStatusFilter = (status: string) => {
    updateSearchParams({ status });
  };

  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 800);

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "read":
        return "Read";
      case "unread":
        return "Unread";

      default:
        return "All Status";
    }
  };

  const user = useCurrentUser();
  const isDisabled = !user || !EDITORIAL_ROLES.includes(user.role);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex lg:hidden relative flex-1 shrink-0 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search messages..."
          defaultValue={searchParams.search || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search messages..."
            defaultValue={searchParams.search || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
              All Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("read")}>
              Read
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("unread")}>
              Unread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {unreadCount > 0 && (
          <Badge className="bg-pink-100 text-pink-800 border-pink-200">
            {unreadCount} unread
          </Badge>
        )}
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
      </div>
    </div>
  );
}
