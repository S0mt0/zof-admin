import { db } from "../config";
import { prismaPaginate } from "@/lib/utils/db.utils";

export const getEvents = async (
  userId: string,
  page: number,
  limit: number,
  search?: string,
  status?: string,
  featured?: string
) => {
  const where: any = { createdBy: userId };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (featured && featured !== "all") {
    where.featured = featured === "featured";
  }

  return prismaPaginate({
    page,
    limit,
    model: db.event,
    args: {
      where,
      include: {
        organizer: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { date: "asc" },
    },
  });
};

export const getEventById = async (id: string) => {
  return db.event.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export const createEvent = async (data: any) => {
  return db.event.create({
    data,
    include: {
      organizer: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export const updateEvent = async (id: string, data: any) => {
  return db.event.update({
    where: { id },
    data,
    include: {
      organizer: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export const deleteEvent = async (id: string) => {
  return db.event.delete({
    where: { id },
  });
};

export const deleteManyEvents = async (ids: string[]) => {
  return db.event.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};
