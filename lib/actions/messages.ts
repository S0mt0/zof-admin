"use server";

import { revalidatePath } from "next/cache";

import {
  deleteManyMessages,
  deleteMessage,
  markAsRead,
} from "../db/repository";
import { MailService } from "../utils/mail.service";
import { capitalize, currentUser } from "../utils";
import { allowedAdminEmailsList } from "../constants";
import { db } from "../db/config";

export const markMessageAsRead = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  if (
    (!allowedAdminEmailsList.includes(user.email!) && user.role !== "editor") ||
    user.role !== "admin"
  ) {
    return { error: "Permission denied!" };
  }

  try {
    await markAsRead(id);
    revalidatePath("/messages");
    return { success: "Message marked as read" };
  } catch (error) {
    return { error: "Error marking message as read" };
  }
};

export const deleteMessageAction = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  if (
    (!allowedAdminEmailsList.includes(user.email!) && user.role !== "editor") ||
    user.role !== "admin"
  ) {
    return { error: "Permission denied!" };
  }

  try {
    await deleteMessage(id);

    revalidatePath("/messages");
    return { success: "Message deleted" };
  } catch (e) {
    return { error: "Error deleting message" };
  }
};

export const replyMessageAction = async (
  to: string,
  subject: string,
  message: string
) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  if (
    (!allowedAdminEmailsList.includes(user.email!) && user.role !== "editor") ||
    user.role !== "admin"
  )
    return { error: "Permission denied!" };

  if (!to || !subject || !message) return { error: "All fields are required" };

  try {
    const mailer = new MailService();
    await mailer.send({
      to,
      subject,
      text: message,
    });

    return { success: "Reply sent" };
  } catch (e) {
    return { error: "Failed to send reply" };
  }
};

export const bulkDeleteMessagesAction = async (ids: string[]) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session. Please log in again." };

  if (user.role !== "admin" && user.role !== "editor")
    return {
      error: "Permission denied.",
    };

  try {
    const result = await deleteManyMessages(ids);
    if (!result) return { error: "No messages were deleted." };

    if (result.count >= 5) {
      const users = await (async () => {
        return await (
          await import("../db/repository/user.service")
        ).getAllUsers({ role: "admin", id: { not: user.id } });
      })();

      const bulkActivities = users.map((u) => ({
        userId: u.id,
        title: "Multiple messages deleted",
        description: `${result.count} message were deleted by ${capitalize(
          user.name!
        )}`,
      }));

      await db.userActivity.createMany({ data: bulkActivities });

      const usersToNotifyEmails = users
        .filter((u) => u.email !== user.email && u.emailNotifications)
        .map((u) => u.email);

      if (usersToNotifyEmails.length > 0) {
        const mailer = new MailService();
        await mailer.send({
          to: usersToNotifyEmails,
          subject: "Multiple messages deleted",
          text: `${capitalize(user.name!)} deleted ${
            result.count
          } message(s) from the system.`,
          html: `<p>${capitalize(user.name!)} deleted ${
            result.count
          } message(s) from the system.</p>`,
        });
      }
    }

    revalidatePath("/messages");

    return { success: `${result.count} message(s) deleted successfully` };
  } catch (e) {
    return { error: "Failed to delete messages" };
  }
};
