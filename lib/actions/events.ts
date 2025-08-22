"use server";

import { revalidateTag } from "next/cache";
import {
  createUserActivity,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteManyEvents,
} from "../db/repository";

export const createEventAction = async (data: any, userId: string) => {
  try {
    const created = await createEvent({
      ...data,
      organizerId: userId,
      createdBy: userId,
    });
    if (created) {
      await createUserActivity(userId, "New event created", created.title);
      revalidateTag("events");
    }
    return { success: "Event created", data: created };
  } catch (e) {
    return { error: "Failed to create event" };
  }
};

export const updateEventAction = async (
  id: string,
  data: any,
  userId: string
) => {
  try {
    const updated = await updateEvent(id, data);
    if (updated) {
      await createUserActivity(userId, "Event details updated", updated.title);
      revalidateTag("events");
    }
    return { success: "Event updated", data: updated };
  } catch (e) {
    return { error: "Failed to update event" };
  }
};

export const deleteEventAction = async (id: string, userId: string) => {
  try {
    const existing = await (async () => {
      try {
        const event = await (
          await import("../db/repository/event.service")
        ).getEventById(id);
        return event;
      } catch {
        return null;
      }
    })();

    await deleteEvent(id);

    await createUserActivity(
      userId,
      "Event deleted",
      existing?.title || "Event removed"
    );
    revalidateTag("events");
    return { success: "Event deleted" };
  } catch (e) {
    return { error: "Failed to delete event" };
  }
};

export const bulkDeleteEventsAction = async (ids: string[], userId: string) => {
  try {
    const existing = await (async () => {
      try {
        const events = await Promise.all(
          ids.map((id) =>
            (async () => {
              try {
                return await (
                  await import("../db/repository/event.service")
                ).getEventById(id);
              } catch {
                return null;
              }
            })()
          )
        );
        return events.filter(Boolean);
      } catch {
        return [];
      }
    })();

    await deleteManyEvents(ids);

    await createUserActivity(
      userId,
      "Multiple events deleted",
      `${ids.length} events removed`
    );
    revalidateTag("events");
    return { success: `${ids.length} events deleted` };
  } catch (e) {
    return { error: "Failed to delete events" };
  }
};
