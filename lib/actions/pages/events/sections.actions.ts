"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  updateEventsArchiveContent,
  updateEventsHeroContent,
} from "@/lib/db/repository/pages/events";
import {
  EventsArchiveSectionSchema,
  EventsHeroSectionSchema,
} from "@/lib/schemas";

import { getAuthorizedUser } from "../shared";
import { logEventsActivity, sectionPath } from "./shared";

export const updateEventsHeroAction = async (
  values: z.infer<typeof EventsHeroSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = EventsHeroSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateEventsHeroContent(validated.data);
    await logEventsActivity(
      "Events hero updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("hero"));
    return { success: "Hero section updated" };
  } catch {
    return { error: "Could not update hero section" };
  }
};

export const updateEventsArchiveAction = async (
  values: z.infer<typeof EventsArchiveSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = EventsArchiveSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateEventsArchiveContent(validated.data);
    await logEventsActivity(
      "Events archive intro updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("archive"));
    return { success: "Archive intro updated" };
  } catch {
    return { error: "Could not update archive intro section" };
  }
};
