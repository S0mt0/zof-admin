import { Prisma } from "@prisma/client";

import { db } from "../config";
import { prismaPaginate } from "@/lib/utils";

interface ListMediaOptions {
  page?: number;
  limit?: number;
  where?: Prisma.MediaWhereInput;
  orderBy?: Prisma.MediaOrderByWithRelationInput;
  select?: Prisma.MediaSelect;
  include?: Prisma.MediaInclude;
}

export const listMedia = async ({
  page = 1,
  limit = 12,
  where,
  orderBy = { createdAt: "desc" },
  select,
  include = {
    createdByUser: {
      select: {
        name: true,
        email: true,
        role: true,
        image: true,
      },
    },
  },
}: ListMediaOptions = {}): Promise<Paginated<MediaRecord>> => {
  try {
    return (await prismaPaginate({
      page,
      limit,
      model: db.media,
      args: {
        where,
        orderBy,
        ...(select ? { select } : { include }),
      },
    })) as Paginated<MediaRecord>;
  } catch (error) {
    console.error("Error listing media: ", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit,
        totalPages: 1,
      },
    };
  }
};

export const createMedia = async (data: Prisma.MediaCreateInput) => {
  try {
    return await db.media.create({
      data,
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating media item: ", error);
    return null;
  }
};

export const getMediaById = async (id: string) => {
  try {
    return await db.media.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching media item: ", error);
    return null;
  }
};

export const deleteMedia = async (id: string) => {
  try {
    return await db.media.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting media item: ", error);
    return null;
  }
};

export const deleteManyMedia = async (ids: string[]) => {
  try {
    const items = await db.media.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        srcKey: true,
        posterKey: true,
      },
    });

    const result = await db.media.deleteMany({
      where: { id: { in: ids } },
    });

    return { result, items };
  } catch (error) {
    console.error("Error deleting media items: ", error);
    return null;
  }
};
