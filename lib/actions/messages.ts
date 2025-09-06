"use server";
import { revalidatePath } from "next/cache";

import {
  addAppActivity,
  deleteManyMessages,
  deleteMessage,
  getUserById,
  toggleStatus,
} from "../db/repository";
import { MailService } from "../utils/mail.service";
import { capitalize, currentUser } from "../utils";
import { EDITORIAL_ROLES } from "../constants";

export const toggleMessageStatusAction = async (
  id: string,
  status: MessageStatus
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    await toggleStatus(id, status);
    revalidatePath("/messages");
    return { success: "Message marked as read" };
  } catch (error) {
    return { error: "Error marking message as read" };
  }
};

export const deleteMessageAction = async (id: string) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const deleted = await deleteMessage(id);
    if (deleted) {
      await addAppActivity(
        "Message deleted",
        `${user.name} (${user.role}) deleted a message from ${capitalize(
          deleted.sender
        )}. The subject of the message was "${capitalize(deleted.subject)}".`
      );

      revalidatePath("/messages");
    }

    return { success: "Message deleted" };
  } catch (e) {
    return { error: "Error deleting message" };
  }
};

export const replyMessageAction = async (
  to: string,
  subject: string,
  message: string,
  recipient?: string
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  if (!to || !subject || !message) return { error: "All fields are required" };

  try {
    const mailer = new MailService();
    await mailer.sendMail({
      to,
      subject,
      text: message,
    });

    await addAppActivity(
      `Reply to ${capitalize(recipient) || to}`,
      `${user.name} (${user.role}) responded to a message from ${
        capitalize(recipient) || to
      }. The subject of the message was "${capitalize(subject)}".`
    );

    return { success: "Reply sent" };
  } catch (e) {
    return { error: "Failed to send reply" };
  }
};

export const bulkDeleteMessagesAction = async (ids: string[]) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const result = await deleteManyMessages(ids);
    if (!result) return { error: "No messages were deleted." };

    await addAppActivity(
      "Message(s) deleted",
      `${user.name} (${user.role}) deleted ${result.count} message(s)`
    );

    revalidatePath("/messages");

    return { success: `${result.count} message(s) deleted successfully` };
  } catch (e) {
    return { error: "Failed to delete messages" };
  }
};
