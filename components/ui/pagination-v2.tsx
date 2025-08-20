"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  showingStart: number;
  showingEnd: number;
  totalItems: number;
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  showingStart,
  showingEnd,
  totalItems,
  itemName = "items",
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // hide everything if no items
  if (!totalItems || totalPages <= 0) return null;

  const setPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    // keep other query params intact
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= 4; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing {showingStart} to {showingEnd} of {totalItems} {itemName}
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className={!hasPrev ? "pointer-events-none opacity-50" : ""}
        >
          <Link
            href={hasPrev ? setPageHref(currentPage - 1) : "#"}
            aria-disabled={!hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-8 h-8"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            }

            const isActive = currentPage === page;

            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="sm"
                asChild
                className="w-8 h-8 p-0"
              >
                <Link
                  href={setPageHref(page as number)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className={!hasNext ? "pointer-events-none opacity-50" : ""}
        >
          <Link
            href={hasNext ? setPageHref(currentPage + 1) : "#"}
            aria-disabled={!hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
