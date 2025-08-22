"use server";

import * as z from "zod";
import { revalidateTag } from "next/cache";
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

export const listTeamAction = async () => {
  const members = await listTeamMembers();
  return members;
};

export const createTeamMemberAction = async (
  values: z.infer<typeof TeamMemberSchema>,
  addedBy: string
) => {
  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const existingMember = await getUniqueTeamMember(values.name, values.email);
  if (existingMember) return { error: "Team member already exists" };

  try {
    const data = validated.data as any;
    const toCreate = {
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone || null,
      bio: data.bio || null,
      status: data.status,
      avatar: data.avatar || null,
      joinDate: new Date(data.joinDate),
      department: data.department || null,
      location: data.location || null,
      skills: data.skills || [],
      addedBy,
      linkedin: data.socialLinks?.linkedin || null,
      twitter: data.socialLinks?.twitter || null,
      github: data.socialLinks?.github || null,
    } as Omit<TeamMember, "id" | "createdAt" | "updatedAt">;

    const created = await createTeamMember(toCreate);
    if (created) {
      await createUserActivity(
        addedBy,
        "New team member added",
        `You added ${created.name} to the team as ${created.role}`
      );
    }

    revalidateTag("teams");
    revalidateTag("recent-activities");
    revalidateTag("user-activity-stats");
    revalidateTag("all-activity-stats");
    return { success: "Team member created" };
  } catch (e) {
    return { error: "Could not create team member" };
  }
};

export const updateTeamMemberAction = async (
  id: string,
  values: z.infer<typeof TeamMemberSchema>,
  updatedBy?: string
) => {
  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const data = validated.data as any;
    const toUpdate: Partial<TeamMember> = {
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone || null,
      bio: data.bio || null,
      status: data.status,
      avatar: data.avatar || null,
      joinDate: new Date(data.joinDate),
      department: data.department || null,
      location: data.location || null,
      skills: data.skills || [],
      linkedin: data.socialLinks?.linkedin || null,
      twitter: data.socialLinks?.twitter || null,
      github: data.socialLinks?.github || null,
    };

    const updated = await updateTeamMember(id, toUpdate);
    if (updated && updatedBy) {
      await createUserActivity(
        updatedBy,
        "Team member details updated",
        `${updated.name}'s profile was updated`
      );
    }

    revalidateTag("teams");
    revalidateTag("team-member");
    revalidateTag("recent-activities");
    revalidateTag("user-activity-stats");
    revalidateTag("all-activity-stats");
    return { success: "Team member updated" };
  } catch (e) {
    return { error: "Could not update team member" };
  }
};

export const deleteTeamMemberAction = async (
  id: string,
  deletedBy?: string
) => {
  try {
    const existing = await getTeamMemberById(id);

    await deleteTeamMember(id);

    if (existing && deletedBy) {
      await createUserActivity(
        deletedBy,
        "Team member removed",
        `${existing.name} was removed from the team`
      );
    }

    revalidateTag("teams");
    revalidateTag("recent-activities");
    revalidateTag("user-activity-stats");
    revalidateTag("all-activity-stats");
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

    revalidateTag("recent-activities");
    return { success: "Email sent" };
  } catch (e) {
    return { error: "Failed to send email" };
  }
};
