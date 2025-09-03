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

export function EventTable({
  data: events,
  selectedEvents,
  onSelectEvent,
  onSelectAll,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  allCurrentSelected,
  someCurrentSelected,
  pagination,
  isPending,
  searchParams,
}: EventTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Events</CardTitle>
        <CardDescription>
          Manage your events, track attendance, and update event details.
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
              <TableHead>Event</TableHead>
              <TableHead className="hidden md:table-cell">
                Date & Time
              </TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableContent
            events={events}
            selectedEvents={selectedEvents}
            onSelectEvent={onSelectEvent}
            onViewEvent={onViewEvent}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
            isPending={isPending}
          />
        </Table>

        <Pagination
          pathname="/events"
          searchParams={searchParams}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          showingStart={(pagination.page - 1) * pagination.limit + 1}
          showingEnd={Math.min(
            pagination.page * pagination.limit,
            pagination.total
          )}
          totalItems={pagination.total}
          itemName="events"
          limit={pagination.limit}
        />
      </CardContent>
    </Card>
  );
}
