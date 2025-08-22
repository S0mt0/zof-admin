"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";
import EventEmptyState from "./event-empty-state";
import {
  deleteEventAction,
  bulkDeleteEventsAction,
} from "@/lib/actions/events";
import { useCurrentUser } from "@/lib/hooks";

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
  const user = useCurrentUser();

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

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedEvents.length} event(s)?`
      )
    ) {
      try {
        const result = await bulkDeleteEventsAction(selectedEvents, user?.id!);
        if (result.success) {
          toast.success(result.success);
          setSelectedEvents([]);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete events");
      }
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

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const result = await deleteEventAction(eventId, user?.id!);
        if (result.success) {
          toast.success(result.success);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete event");
      }
    }
  };

  const allCurrentSelected =
    events.length > 0 &&
    events.every((event) => selectedEvents.includes(event.id));

  const someCurrentSelected = events.some((event) =>
    selectedEvents.includes(event.id)
  );

  if (events.length === 0) {
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
