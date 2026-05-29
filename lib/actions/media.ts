"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import { MediaSchema, UpdateMediaSchema } from "../schemas";
import {
  createManyMedia,
  createMedia,
  deleteManyMedia,
  deleteMedia,
  getMediaById,
  updateMedia,
} from "../db/repository/media.service";
import { getUserById } from "../db/repository/user.service";
import { addAppActivity } from "../db/repository/app-activity.service";
import { capitalize, currentUser } from "../utils";
import { deleteS3Object } from "./s3";
import { EDITORIAL_ROLES } from "../constants";

type S3DeleteTarget = {
  srcKey: string;
  posterKey?: string | null;
};

const isExternalKey = (key?: string | null) => !key || key.startsWith("external:");

const deleteMediaFilesFromS3 = async (items: S3DeleteTarget[]) => {
  const deleteTargets = items.flatMap((item) => [item.srcKey, item.posterKey]).filter(
    (key): key is string => !isExternalKey(key)
  );

  const results = await Promise.allSettled(
    deleteTargets.map((key) => deleteS3Object(key))
  );

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    console.error("Some media files could not be deleted from S3", failed);
  }
};

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

    revalidatePath("/media/manage");
    revalidatePath("/media");
    return { success: "Media uploaded successfully", data: { media: created } };
  } catch (error) {
    return { error: "Failed to upload media" };
  }
};

export const createManyMediaAction = async (
  values: z.input<typeof MediaSchema>[]
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };
  if (values.length === 0) return { error: "No media items selected" };
  if (values.length > 10) {
    return { error: "You can upload up to 10 photos at once" };
  }

  const validated = z.array(MediaSchema).safeParse(values);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Invalid fields" };
  }

  const hasVideo = validated.data.some((item) => item.type === "video");
  if (hasVideo) return { error: "Batch upload is only available for photos" };

  try {
    const created = await createManyMedia(
      validated.data.map((payload) => ({
        ...payload,
        createdBy: user.id,
        type: payload.type,
      })) as any
    );

    if (!created) return { error: "Failed to save media items" };

    await addAppActivity(
      "Media uploaded",
      `${user.name} (${user.role}) uploaded ${created.length} photo(s) to the media library`
    );

    revalidatePath("/media/manage");
    revalidatePath("/media");
    return {
      success: `${created.length} photo(s) uploaded successfully`,
      data: { media: created },
    };
  } catch (error) {
    return { error: "Failed to upload media" };
  }
};

export const updateMediaAction = async (
  values: z.input<typeof UpdateMediaSchema>
) => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session. Please log in again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  const validated = UpdateMediaSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Invalid fields" };
  }

  try {
    const { id, type, ...payload } = validated.data;
    const media = await getMediaById(id);

    if (!media) return { error: "Media item does not exist" };
    if (media.type !== type) return { error: "Media type cannot be changed" };

    const updated = await updateMedia(id, payload);
    if (!updated) return { error: "Failed to update media item" };

    const label =
      updated.type === "photo"
        ? updated.alt || updated.caption || "photo"
        : updated.title || updated.caption || "video";

    await addAppActivity(
      "Media updated",
      `${user.name} (${user.role}) updated ${updated.type}, "${capitalize(label)}"`
    );

    revalidatePath("/media/manage");
    revalidatePath("/media");
    return { success: "Media updated successfully", data: { media: updated } };
  } catch (error) {
    return { error: "Failed to update media" };
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

    await deleteMediaFilesFromS3([media]);

    await addAppActivity(
      "Media deleted",
      `${user.name} (${user.role}) deleted a ${media.type} from the media library`
    );

    revalidatePath("/media/manage");
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
    if (deleted.items.length === 0) {
      return { error: "Selected media items were already deleted" };
    }

    await deleteMediaFilesFromS3(deleted.items);

    await addAppActivity(
      "Media deleted",
      `${user.name} (${user.role}) deleted ${deleted.items.length} media item(s) from the library`
    );

    revalidatePath("/media/manage");
    revalidatePath("/media");
    return {
      success: `${deleted.items.length} media item(s) deleted successfully`,
    };
  } catch (error) {
    return { error: "Failed to delete media items" };
  }
};
