import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { bulkDeleteEventsAction, deleteEventAction } from "../actions/events";
import { EDITORIAL_ROLES } from "../constants";
import { useCurrentUser } from "./use-current-user";

export const useReadEvents = (events: IEvent[]) => {
  const [isPending, startTransition] = useTransition();
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
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    if (selectedEvents.length === 0) return;

    if (selectedEvents.length === 1)
      return handleDeleteEvent(selectedEvents[0]);

    if (
      confirm(
        `Are you sure you want to delete ${selectedEvents.length} events?`
      )
    ) {
      const loading = toast.loading("Please wait...");
      startTransition(() => {
        bulkDeleteEventsAction(selectedEvents)
          .then((result) => {
            if (result.success) {
              toast.success(result.success);
              setSelectedEvents([]);
            } else {
              toast.error(result.error);
            }
          })
          .catch((e) => {
            toast.error("Failed to delete events");
          })
          .finally(() => {
            toast.dismiss(loading);
          });
      });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    if (confirm("Are you sure you want to delete this event?")) {
      const loading = toast.loading("Please wait...");
      startTransition(() => {
        deleteEventAction(eventId)
          .then((result) => {
            if (result.success) {
              toast.success(result.success);
              setSelectedEvents([]);
            } else {
              toast.error(result.error);
            }
          })
          .catch((e) => {
            toast.error("Failed to delete event");
          })
          .finally(() => {
            toast.dismiss(loading);
          });
      });
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
    isPending,
    handleSelectEvent,
    handleSelectAll,
    handleBulkDelete,
    handleDeleteEvent,
    handleViewEvent,
    handleEditEvent,
  };
};
