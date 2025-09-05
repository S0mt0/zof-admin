"use server";

import * as z from "zod";

import { TeamMemberSchema } from "../schemas";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getUniqueTeamMember,
  addAppActivity,
  getUserById,
} from "../db/repository";
import { MailService } from "../utils/mail.service";
import { capitalize, currentUser } from "../utils";
import { EDITORIAL_ROLES } from "../constants";
import { revalidatePath } from "next/cache";

export const createTeamMemberAction = async (
  values: z.infer<typeof TeamMemberSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const existingMember = await getUniqueTeamMember(values.name, values.email);
  if (existingMember) return { error: "Team member already exists" };

  try {
    const data = validated.data;
    const payload = {
      ...data,
      addedBy: user.id,
      joinDate: new Date(data.joinDate),
      name: capitalize(validated.data.name),
    };

    const created = await createTeamMember(payload);
    if (created) {
      await addAppActivity(
        "New team member added",
        `${user.name} (${user.role}) added ${created.name} to the team as "${created.role}"`
      );
      revalidatePath("/");
    }

    return { success: "Team member added" };
  } catch (e) {
    return { error: "Could not add team member" };
  }
};

export const updateTeamMemberAction = async (
  id: string,
  values: z.infer<typeof TeamMemberSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    let data = validated.data;

    if (data.name) {
      data = { ...data, name: capitalize(data.name) };
    }

    const updated = await updateTeamMember(id, {
      ...data,
      joinDate: new Date(data.joinDate),
    });

    if (updated) {
      await addAppActivity(
        "Team member info updated",
        `${user.name} (${user.role}) made some changes to ${updated.name}'s details.`
      );
      revalidatePath("/");
    }

    return { success: "Team member updated" };
  } catch (e) {
    return { error: "Could not update team member" };
  }
};

export const deleteTeamMemberAction = async (id: string) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const deleted = await deleteTeamMember(id);

    if (deleted) {
      await addAppActivity(
        "Team member removed",
        `${user.name} (${user.role}) removed ${deleted.name} from the team`
      );
      revalidatePath("/");
    }

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
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

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
