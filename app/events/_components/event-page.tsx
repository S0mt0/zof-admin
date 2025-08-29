"use client";

import { useReadEvents } from "@/lib/hooks";
import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";

export function EventPage({
  events,
  pagination,
  searchParams,
}: EventPageProps) {
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
  } = useReadEvents(events);

  return (
    <div>
      <EventFilters
        searchParams={searchParams}
        selectedCount={selectedEvents.length}
        onBulkDelete={handleBulkDelete}
      />

      <EventTable
        events={events}
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
