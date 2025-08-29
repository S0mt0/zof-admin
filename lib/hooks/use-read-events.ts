import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { bulkDeleteEventsAction, deleteEventAction } from "../actions/events";

export const useReadEvents = (events: IEvent[]) => {
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

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedEvents.length} events?`
      )
    ) {
      const loading = toast.loading("Please wait...");
      try {
        const result = await bulkDeleteEventsAction(selectedEvents);
        if (result.success) {
          toast.success(result.success);
          setSelectedEvents([]);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete events");
      } finally {
        toast.dismiss(loading);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const loading = toast.loading("Please wait...");
      try {
        const result = await deleteEventAction(eventId);
        if (result.success) {
          toast.success(result.success);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete event");
      } finally {
        toast.dismiss(loading);
      }
    }
  };

  const allCurrentSelected =
    events.length > 0 &&
    events.every((event) => selectedEvents.includes(event.id));

  const someCurrentSelected = events.some((event) =>
    selectedEvents.includes(event.id)
  );

  const handleViewEvent = (event: IEvent) => {
    router.push(`/events/${event.slug}`);
  };

  const handleEditEvent = (event: IEvent) => {
    router.push(`/events/${event.slug}/edit`);
  };

  return {
    selectedEvents,
    allCurrentSelected,
    someCurrentSelected,
    handleSelectEvent,
    handleSelectAll,
    handleBulkDelete,
    handleDeleteEvent,
    handleViewEvent,
    handleEditEvent,
  };
};
