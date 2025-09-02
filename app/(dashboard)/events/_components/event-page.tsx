"use client";

import { useReadEvents } from "@/lib/hooks";
import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";
import EventEmptyState from "./event-empty-state";

export function EventPage({ data, pagination, searchParams }: EventPageProps) {
  const {
    selectedEvents,
    allCurrentSelected,
    someCurrentSelected,
    handleBulkDelete,
    handleDeleteEvent,
    handleEditEvent,
    handleSelectAll,
    handleSelectEvent,
    handleViewEvent,
  } = useReadEvents(data);

  if (data.length === 0) {
    return (
      <div>
        <EventFilters
          searchParams={searchParams}
          selectedCount={selectedEvents.length}
          onBulkDelete={handleBulkDelete}
        />
        <EventEmptyState />
      </div>
    );
  }

  return (
    <div>
      <EventFilters
        searchParams={searchParams}
        selectedCount={selectedEvents.length}
        onBulkDelete={handleBulkDelete}
      />

      <EventTable
        data={data}
        selectedEvents={selectedEvents}
        onSelectEvent={handleSelectEvent}
        onSelectAll={handleSelectAll}
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        allCurrentSelected={allCurrentSelected}
        someCurrentSelected={someCurrentSelected}
        pagination={pagination}
        searchParams={searchParams}
      />
    </div>
  );
}
