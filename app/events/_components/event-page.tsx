"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";
import { EventStats } from "./event-stats";

interface EventPageProps {
  events: IEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
  };
}

export function EventPage({
  events,
  pagination,
  searchParams,
}: EventPageProps) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const router = useRouter();

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    const currentEventIds = events.map((event) => event.id);
    const allCurrentSelected = currentEventIds.every((id) =>
      selectedEvents.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedEvents((prev) =>
        prev.filter((id) => !currentEventIds.includes(id))
      );
    } else {
      setSelectedEvents((prev) => [...new Set([...prev, ...currentEventIds])]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedEvents.length} event(s)?`
      )
    ) {
      console.log("Bulk deleting events:", selectedEvents);
      setSelectedEvents([]);
      // Add actual bulk delete logic here
    }
  };

  const handleViewEvent = (event: IEvent) => {
    console.log("Viewing event details:", event);
  };

  const handleEditEvent = (event: IEvent) => {
    router.push(`/events/${event.id}/edit`);
  };

  const handleManageAttendees = (event: IEvent) => {
    console.log("Managing attendees for event:", event);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      console.log("Deleting event:", eventId);
    }
  };

  const allCurrentSelected =
    events.length > 0 &&
    events.every((event) => selectedEvents.includes(event.id));

  const someCurrentSelected = events.some((event) =>
    selectedEvents.includes(event.id)
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Events" breadcrumbs={[{ label: "Events" }]} />

      <EventStats events={events} />

      <EventFilters
        searchParams={searchParams}
        selectedCount={selectedEvents.length}
        onBulkDelete={handleBulkDelete}
        onCreateNew={() => router.push("/events/new")}
      />

      <EventTable
        events={events}
        selectedEvents={selectedEvents}
        onSelectEvent={handleSelectEvent}
        onSelectAll={handleSelectAll}
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onManageAttendees={handleManageAttendees}
        onDeleteEvent={handleDeleteEvent}
        allCurrentSelected={allCurrentSelected}
        someCurrentSelected={someCurrentSelected}
        pagination={pagination}
        searchParams={searchParams}
      />
    </div>
  );
}
