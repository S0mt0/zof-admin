"use server";

import * as z from "zod";

import { TeamMemberSchema, VolunteerSchema } from "../schemas";
import {
  createVolunteer,
  createTeamMember,
  deleteVolunteer,
  updateTeamMember,
  deleteTeamMember,
  getUniqueVolunteer,
  getUniqueTeamMember,
  updateVolunteer,
} from "../db/repository/team.service";
import { getUserById } from "../db/repository/user.service";
import { addAppActivity } from "../db/repository/app-activity.service";

import { MailService } from "../utils/mail.service";
import { capitalize } from "../utils";
import { currentUser } from "../utils/auth.utils";
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
      twitter: data.twitter || data.x,
    };

    const created = await createTeamMember(payload);
    if (created) {
      await addAppActivity(
        "New team member added",
        `${user.name} (${user.role}) added ${created.name} to the team as "${created.role}"`
      );
      revalidatePath("/");
      revalidatePath("/team");
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
      twitter: data.twitter || data.x,
    });

    if (updated) {
      await addAppActivity(
        "Team member info updated",
        `${user.name} (${user.role}) made some changes to ${updated.name}'s details.`
      );
      revalidatePath("/");
      revalidatePath("/team");
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
      revalidatePath("/team");
    }

    return { success: "Team member removed" };
  } catch (e) {
    return { error: "Could not remove team member" };
  }
};

export const createVolunteerAction = async (
  values: z.infer<typeof VolunteerSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = VolunteerSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const existingVolunteer = await getUniqueVolunteer(
    validated.data.name,
    validated.data.volunteerType
  );
  if (existingVolunteer) return { error: "Volunteer already exists" };

  try {
    const created = await createVolunteer({
      ...validated.data,
      name: capitalize(validated.data.name),
      addedBy: user.id,
    });

    if (created) {
      await addAppActivity(
        "New volunteer added",
        `${user.name} (${user.role}) added ${created.name} as "${created.volunteerType}"`
      );
      revalidatePath("/team");
      revalidatePath("/volunteers");
      revalidatePath("/landing/volunteers");
    }

    return { success: "Volunteer added" };
  } catch (e) {
    return { error: "Could not add volunteer" };
  }
};

export const updateVolunteerAction = async (
  id: string,
  values: z.infer<typeof VolunteerSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = VolunteerSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const updated = await updateVolunteer(id, {
      ...validated.data,
      name: capitalize(validated.data.name),
    });

    if (updated) {
      await addAppActivity(
        "Volunteer info updated",
        `${user.name} (${user.role}) updated ${updated.name}'s volunteer details.`
      );
      revalidatePath("/team");
      revalidatePath("/volunteers");
      revalidatePath("/landing/volunteers");
    }

    return { success: "Volunteer updated" };
  } catch (e) {
    return { error: "Could not update volunteer" };
  }
};

export const deleteVolunteerAction = async (id: string) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");
  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const deleted = await deleteVolunteer(id);

    if (deleted) {
      await addAppActivity(
        "Volunteer removed",
        `${user.name} (${user.role}) removed ${deleted.name} from volunteers`
      );
      revalidatePath("/team");
      revalidatePath("/volunteers");
      revalidatePath("/landing/volunteers");
    }

    return { success: "Volunteer removed" };
  } catch (e) {
    return { error: "Could not remove volunteer" };
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
    await mailer.sendMail({
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
