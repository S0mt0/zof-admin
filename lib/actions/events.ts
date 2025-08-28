"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { format } from "date-fns";
import * as z from "zod";

import {
  createUserActivity,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteManyEvents,
} from "../db/repository";
import { capitalize, currentUser } from "../utils";
import { MailService } from "../utils/mail.service";
import { db } from "../db";
import { EventFormSchema } from "../schemas";

export const createEventAction = async (
  data: z.infer<typeof EventFormSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

  try {
    const existingEvent = await (async () => {
      try {
        const event = await (
          await import("../db/repository/event.service")
        ).getEventByTitle(data.title!);

        return event;
      } catch {
        return null;
      }
    })();

    if (existingEvent)
      return {
        error: "An event with the same title already exists, try again.",
      };

    const newEvent = await createEvent({
      ...data,
      organizerId: user.id,
      createdBy: user.id,
    });
    if (newEvent) {
      await createUserActivity(
        user.id,
        "New event created",
        capitalize(newEvent.title)
      );

      revalidateTag("profile-stats");
      revalidatePath("/events");
      revalidatePath("/");
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
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

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

    if (!event)
      return {
        error: "Event not found",
      };

    if (
      event.createdBy !== user.id &&
      user.role !== "admin" &&
      user.role !== "editor"
    )
      return {
        error: "Permission denied.",
      };

    const updated = await updateEvent(eventId, data);
    if (updated) {
      await createUserActivity(
        user.id,
        "Event details updated",
        `Title: "${capitalize(updated.title)}"`
      );

      if (updated.createdBy !== user.id && updated?.createdByUser?.email) {
        if (updated?.createdByUser?.emailNotifications) {
          const mailer = new MailService();
          await mailer.sendEventUpdateEmail(user as any, updated);
        }

        await createUserActivity(
          updated?.createdBy!,
          "Event updated",
          `Your event titled "${updated.title}" was updated by ${
            user.role === "admin" ? "an administrator" : "an editor"
          }, ${capitalize(user.name!)} on ${format(
            updated.updatedAt,
            "EEEE, MMMM d, yyyy 'at' h:mmaaa"
          )}.`
        );
      }

      revalidateTag("profile-stats");
      revalidateTag("event");
      revalidatePath("/events");
      revalidatePath("/");
    }
    return { success: "Event updated", data: { event: updated } };
  } catch (e) {
    return { error: "Failed to update event" };
  }
};

export const deleteEventAction = async (eventId: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

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

    if (
      event.createdBy !== user.id &&
      user.role !== "admin" &&
      user.role !== "editor"
    )
      return {
        error: "Permission denied.",
      };

    const deleted = await deleteEvent(event.id);

    if (deleted) {
      await createUserActivity(
        user.id,
        "Event deleted",
        `Title: "${capitalize(deleted.title)}"`
      );

      if (deleted.createdBy !== user.id && deleted.createdByUser?.email) {
        if (deleted?.createdByUser?.emailNotifications) {
          const mailer = new MailService();
          await mailer.sendEventDeleteEmail(user as any, deleted);
        }

        await createUserActivity(
          deleted?.createdBy!,
          "Event deleted",
          `Your event titled 
      "${capitalize(deleted.title)}" was deleted by ${
            user.role === "admin" ? "an administrator" : "an editor"
          }, ${capitalize(user.name!)} on ${format(
            deleted.updatedAt,
            "EEEE, MMMM d, yyyy 'at' h:mmaaa"
          )}.`
        );
      }

      revalidateTag("profile-stats");
      revalidateTag("event");
      revalidatePath("/events");
      revalidatePath("/");
    }

    return { success: "Event deleted successfully" };
  } catch (e) {
    return { error: "Failed to delete event" };
  }
};

export const bulkDeleteEventsAction = async (ids: string[]) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

  if (user.role !== "admin" && user.role !== "editor")
    return {
      error: "Permission denied.",
    };

  try {
    const result = await deleteManyEvents(ids);
    if (!result) return { error: "No events were deleted." };

    if (result.count >= 5) {
      const users = await (async () => {
        return await (
          await import("../db/repository/user.service")
        ).getAllUsers();
      })();

      const bulkActivities = users
        .filter((u) => u.id !== user.id)
        .map((u) => ({
          userId: u.id,
          title: "Multiple event deleted",
          description: `${result.count} event were removed by ${capitalize(
            user.name!
          )}`,
        }));

      await db.userActivity.createMany({ data: bulkActivities });

      const usersToNotifyEmails = users
        .filter((u) => u.email !== user.email && u.emailNotifications)
        .map((u) => u.email);

      if (usersToNotifyEmails.length > 0) {
        const mailer = new MailService();
        await mailer.sendEventBulkDeleteEmail(
          user as any,
          usersToNotifyEmails,
          result.count
        );
      }
    }

    revalidateTag("profile-stats");
    revalidatePath("/events");
    revalidatePath("/");
    revalidateTag("event");

    return { success: `${result.count} event(s) deleted successfully` };
  } catch (e) {
    return { error: "Failed to delete events" };
  }
};
