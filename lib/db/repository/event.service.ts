import { emptyPaginatedData } from "@/lib/constants";
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

  try {
    return prismaPaginate({
      page,
      limit,
      model: db.event,
      args: {
        where,
        include: {
          createdByUser: {
            select: {
              name: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: { date: "asc" },
      },
    });
  } catch (error) {
    console.log("error fetching events", error);
    return emptyPaginatedData;
  }
};

export const getEventById = async (id: string) => {
  try {
    return await db.event.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error getting event", error);
    return null;
  }
};

export const createEvent = async (data: any) => {
  try {
    return await db.event.create({
      data,
      include: {
        createdByUser: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error creating event", error);
    return null;
  }
};

export const updateEvent = async (id: string, data: any) => {
  try {
    return await db.event.update({
      where: { id },
      data,
      include: {
        createdByUser: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error updating event", error);
    return null;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    return await db.event.delete({
      where: { id },
    });
  } catch (error) {
    console.log("error deleting event", error);
    return null;
  }
};

export const deleteManyEvents = async (ids: string[]) => {
  try {
    return await db.event.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  } catch (error) {
    console.log("error deleting many events", error);
    return null;
  }
};
