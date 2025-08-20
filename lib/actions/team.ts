"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { TeamMemberSchema } from "../schemas";
import {
  listTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getUniqueTeamMember,
} from "../db/data";
import { MailService } from "../utils/mail.service";

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

    await createTeamMember(toCreate);
    revalidatePath("/team");
    return { success: "Team member created" };
  } catch (e) {
    return { error: "Could not create team member" };
  }
};

export const updateTeamMemberAction = async (
  id: string,
  values: z.infer<typeof TeamMemberSchema>
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

    await updateTeamMember(id, toUpdate);
    revalidatePath("/team");
    return { success: "Team member updated" };
  } catch (e) {
    return { error: "Could not update team member" };
  }
};

export const deleteTeamMemberAction = async (id: string) => {
  try {
    await deleteTeamMember(id);
    revalidatePath("/team");
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
    return { success: "Email sent" };
  } catch (e) {
    return { error: "Failed to send email" };
  }
};
