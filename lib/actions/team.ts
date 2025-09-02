"use server";

import * as z from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

import { TeamMemberSchema } from "../schemas";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getUniqueTeamMember,
  addAppActivity,
  getTeamMemberByEmail,
} from "../db/repository";
import { MailService } from "../utils/mail.service";
import { capitalize, currentUser } from "../utils";
import { EDITORIAL_ROLES } from "../constants";

export const createTeamMemberAction = async (
  values: z.infer<typeof TeamMemberSchema>
) => {
  const user = await currentUser();
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
    };

    const created = await createTeamMember(payload);
    if (created) {
      await addAppActivity(
        "New team member added",
        `${capitalize(user.name!)} (${user.role}) added ${capitalize(
          created.name
        )} to the team as "${created.role}"`
      );
    }

    revalidatePath("/");
    revalidatePath("/team");
    revalidateTag("profile-stats");
    return { success: "Team member added" };
  } catch (e) {
    return { error: "Could not add team member" };
  }
};

export const updateTeamMemberAction = async (
  id: string,
  values: z.infer<typeof TeamMemberSchema>
) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = TeamMemberSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const data = validated.data;

    const updated = await updateTeamMember(id, {
      ...data,
      joinDate: new Date(data.joinDate),
    });

    if (updated) {
      await addAppActivity(
        "Team member info updated",
        `${capitalize(user.name!)} (${
          user.role
        }) made some changes to ${capitalize(updated.name)}'s details.`
      );
    }

    revalidatePath("/");
    revalidatePath("/team");

    return { success: "Team member updated" };
  } catch (e) {
    return { error: "Could not update team member" };
  }
};

export const deleteTeamMemberAction = async (id: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const deleted = await deleteTeamMember(id);

    if (deleted) {
      await addAppActivity(
        "Team member removed",
        `${capitalize(user.name!)} (${user.role}) removed ${
          deleted.name
        } from the team`
      );
    }

    revalidatePath("/");
    revalidatePath("/team");
    revalidateTag("profile-stats");
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

    const user = await currentUser();
    const teamMember = await getTeamMemberByEmail(to);

    return { success: "Email sent" };
  } catch (e) {
    return { error: "Failed to send email" };
  }
};
