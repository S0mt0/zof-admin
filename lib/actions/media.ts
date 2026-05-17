"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { MediaSchema } from "../schemas";
import {
  createMedia,
  deleteManyMedia,
  deleteMedia,
  getMediaById,
} from "../db/repository/media.service";
import { getUserById } from "../db/repository/user.service";
import { addAppActivity } from "../db/repository/app-activity.service";
import { capitalize, currentUser } from "../utils";
import { deleteS3Object } from "./s3";
import { EDITORIAL_ROLES } from "../constants";

export const createMediaAction = async (
  values: z.input<typeof MediaSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = MediaSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Invalid fields" };
  }

  try {
    const payload = validated.data;
    const created = await createMedia({
      ...payload,
      createdBy: user.id,
      type: payload.type,
    } as any);

    if (!created) return { error: "Failed to save media item" };

    const label =
      created.type === "photo"
        ? created.alt || created.caption || "photo"
        : created.title || created.caption || "video";

    await addAppActivity(
      "Media uploaded",
      `${user.name} (${user.role}) uploaded a new ${
        created.type
      }, "${capitalize(label)}"`
    );

    revalidatePath("/media");
    return { success: "Media uploaded successfully", data: { media: created } };
  } catch (error) {
    return { error: "Failed to upload media" };
  }
};

export const deleteMediaAction = async (id: string) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  try {
    const media = await getMediaById(id);
    if (!media) return { error: "Media item does not exist" };

    const deleted = await deleteMedia(id);
    if (!deleted) return { error: "Failed to delete media item" };

    await Promise.all([
      deleteS3Object(media.srcKey),
      media.posterKey ? deleteS3Object(media.posterKey) : Promise.resolve(),
    ]);

    await addAppActivity(
      "Media deleted",
      `${user.name} (${user.role}) deleted a ${media.type} from the media library`
    );

    revalidatePath("/media");
    return { success: "Media item deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete media item" };
  }
};

export const bulkDeleteMediaAction = async (ids: string[]) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };
  if (ids.length === 0) return { error: "No media items selected" };

  try {
    const deleted = await deleteManyMedia(ids);
    if (!deleted) return { error: "Failed to delete media items" };

    await Promise.all(
      deleted.items.flatMap(
        (item: { id: string; srcKey: string; posterKey: string | null }) => [
          deleteS3Object(item.srcKey),
          item.posterKey ? deleteS3Object(item.posterKey) : Promise.resolve(),
        ]
      )
    );

    await addAppActivity(
      "Media deleted",
      `${user.name} (${user.role}) deleted ${deleted.result.count} media item(s) from the library`
    );

    revalidatePath("/media");
    return {
      success: `${deleted.result.count} media item(s) deleted successfully`,
    };
  } catch (error) {
    return { error: "Failed to delete media items" };
  }
};
