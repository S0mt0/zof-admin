import { prismaPaginate } from "@/lib/utils/db.utils";
import { db } from "../config";
import { emptyPaginatedData } from "@/lib/constants";

export const getAllMessages = async ({
  limit,
  page,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string | null;
}) => {
  const where: any = {};

  if (search) {
    where.OR = [
      { sender: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  try {
    return await prismaPaginate({
      page,
      limit,
      model: db.message,
      args: {
        where,
        orderBy: { createdAt: "desc" },
      },
    });
  } catch (error) {
    console.log("error fetching all messages", error);
    return emptyPaginatedData;
  }
};

export const countUnreadMessages = async () => {
  try {
    return await db.message.count({
      where: { status: "unread" },
    });
  } catch (e) {
    console.log("error counting unread messages", e);
    return 0;
  }
};

export const deleteMessage = async (id: string) => {
  try {
    return (await db.message.delete({ where: { id } })) as IMessage;
  } catch (e) {
    return null;
  }
};

export const deleteManyMessages = async (ids: string[]) => {
  try {
    return await db.message.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  } catch (error) {
    console.log("error deleting many messages", error);
    return null;
  }
};

export const toggleStatus = async (id: string, status: MessageStatus) => {
  try {
    return await db.message.update({
      where: {
        id,
      },
      data: { status },
    });
  } catch (error) {
    console.log("error deleting many messages", error);
    return null;
  }
};
