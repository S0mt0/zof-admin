"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as z from "zod";

import {
  addAppActivity,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteManyEvents,
  getUserById,
} from "../db/repository";
import { capitalize, currentUser } from "../utils";
import { MailService } from "../utils/mail.service";
import { EventFormSchema } from "../schemas";
import { EDITORIAL_ROLES } from "../constants";

export const createEventAction = async (
  data: z.infer<typeof EventFormSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const existingEvent = await (async () => {
      try {
        const event = await (
          await import("../db/repository/event.service")
        ).getEventByName(data.name);

        return event;
      } catch {
        return null;
      }
    })();

    if (existingEvent) {
      return {
        error: "An event with the same name already exists, try again.",
      };
    }

    const newEvent = await createEvent({
      ...data,
      createdBy: user.id,
      date: new Date(data.date),
    });

    if (newEvent) {
      await addAppActivity(
        "New event added",
        `${capitalize(user.name!)} just added a new event, "${capitalize(
          newEvent.name
        )}"`
      );

      revalidateTag("event");
    }
    return { success: "Event created", data: { event: newEvent } };
  } catch (e) {
    return { error: "Failed to create event" };
  }
};

export const updateEventAction = async (
  eventId: string,
  data: z.infer<typeof EventFormSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const event = await (async () => {
      try {
        const event = await (
          await import("../db/repository/event.service")
        ).getEventById(eventId);

        return event;
      } catch {
        return null;
      }
    })();

    if (!event) return { error: "Event not found" };

    const updated = await updateEvent(eventId, {
      ...data,
      date: new Date(data.date),
    });

    if (updated) {
      await addAppActivity(
        "Event updated",
        `${capitalize(user.name!)} (${
          user.role
        }) made some changes to the event, "${capitalize(event.name)}"`
      );

      revalidateTag("event");
    }
    return { success: "Event updated", data: { event: updated } };
  } catch (e) {
    return { error: "Failed to update event" };
  }
};

export const deleteEventAction = async (eventId: string) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const event = await (async () => {
      try {
        const event = await (
          await import("../db/repository/event.service")
        ).getEventById(eventId);

        return event;
      } catch {
        return null;
      }
    })();

    if (!event) return { error: "Event does not exist" };

    const deleted = await deleteEvent(event.id);

    if (deleted) {
      await addAppActivity(
        "Event deleted",
        `${capitalize(user.name!)} (${
          user.role
        }) deleted the event, "${capitalize(deleted.name)}"`
      );

      if (
        deleted.createdBy !== user.id &&
        deleted.createdByUser?.email &&
        deleted?.createdByUser?.emailNotifications
      ) {
        const mailer = new MailService();
        await mailer.sendEventDeleteEmail(user as any, deleted);
      }

      revalidateTag("event");
    }

    return { success: "Event deleted successfully" };
  } catch (e) {
    return { error: "Failed to delete event" };
  }
};

export const bulkDeleteEventsAction = async (ids: string[]) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const result = await deleteManyEvents(ids);
    if (!result) return { error: "No events were deleted." };

    await addAppActivity(
      "Event(s) deleted",
      `${capitalize(user.name!)} (${user.role}) deleted ${
        result.count
      } event(s)"`
    );

    revalidateTag("event");

    return { success: `${result.count} event(s) deleted successfully` };
  } catch (e) {
    return { error: "Failed to delete events" };
  }
};
