import { prismaPaginate } from "@/lib/utils/db.utils";
import { db } from "../config";
import { emptyPaginatedData } from "@/lib/constants";

export const getUsersRecentActivities = async (
  page: number,
  limit: number,
  userId: string
) => {
  try {
    return await prismaPaginate({
      page,
      limit,
      model: db.userActivity,
      args: {
        where: { userId },
        orderBy: { createdAt: "desc" },
      },
    });
  } catch (error) {
    console.log("error fetching activities", error);

    return emptyPaginatedData;
  }
};

export const createUserActivity = async (
  userId: string,
  title: string,
  description: string
) => {
  try {
    return await db.userActivity.create({
      data: {
        userId,
        title,
        description,
      },
    });
  } catch (e) {
    return null;
  }
};
