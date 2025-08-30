"use server";

import * as z from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

import { TeamMemberSchema } from "../schemas";
import {
  listTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getUniqueTeamMember,
  createUserActivity,
  getTeamMemberByEmail,
} from "../db/repository";
import { MailService } from "../utils/mail.service";
import { currentUser } from "../utils";
import { allowedAdminEmailsList } from "../constants";

export const listTeamAction = async () => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  const members = await listTeamMembers();
  return members;
};

export const createTeamMemberAction = async (
  values: z.infer<typeof TeamMemberSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  if (
    (!allowedAdminEmailsList.includes(user.email!) && user.role !== "editor") ||
    user.role !== "admin"
  )
    return { error: "Permission denied!" };

  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const existingMember = await getUniqueTeamMember(values.name, values.email);
  if (existingMember) return { error: "Team member already exists" };

  try {
    const data = validated.data;
    const payload = {
      ...data,
      addedBy: user.id,
    };

    const created = await createTeamMember(payload);
    if (created) {
      await createUserActivity(
        user.id,
        "New team member added",
        `You added ${created.name} to the team as ${created.role}`
      );
    }

    revalidateTag("teams");
    revalidateTag("profile-stats");
    revalidatePath("/");
    return { success: "Team member added" };
  } catch (e) {
    return { error: "Could not create team member" };
  }
};

export const updateTeamMemberAction = async (
  id: string,
  values: z.infer<typeof TeamMemberSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  if (
    (!allowedAdminEmailsList.includes(user.email!) && user.role !== "editor") ||
    user.role !== "admin"
  )
    return { error: "Permission denied!" };

  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const data = validated.data;

    const updated = await updateTeamMember(id, data);
    if (updated) {
      await createUserActivity(
        user.id,
        "Team member details updated",
        `You successfully updated ${updated.name}'s profile.`
      );
    }

    revalidateTag("teams");
    revalidatePath("/");
    revalidateTag("profile-stats");

    return { success: "Team member updated" };
  } catch (e) {
    return { error: "Could not update team member" };
  }
};

export const deleteTeamMemberAction = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };

  if (
    (!allowedAdminEmailsList.includes(user.email!) && user.role !== "editor") ||
    user.role !== "admin"
  )
    return { error: "Permission denied!" };

  try {
    const existing = await getTeamMemberById(id);

    await deleteTeamMember(id);

    if (existing) {
      await createUserActivity(
        user.id,
        "Team member removed",
        `${existing.name} was removed from the team`
      );
    }

    revalidateTag("teams");
    revalidateTag("profile-stats");
    revalidatePath("/");
    return { success: "Team member removed" };
  } catch (e) {
    return { error: "Could not remove team member" };
  }
};

export const emailTeamMemberAction = async (
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
      html: `<p>${message}</p>`,
    });

    const user = await currentUser();
    const teamMember = await getTeamMemberByEmail(to);

    await createUserActivity(
      user?.id!,
      "Email Sent",
      `You successfully sent an email to a member of the team ${teamMember?.name}.`
    );

    revalidateTag("users-recent-activities");
    return { success: "Email sent" };
  } catch (e) {
    return { error: "Failed to send email" };
  }
};
