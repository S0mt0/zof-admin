import { prismaPaginate } from "@/lib/utils/db.utils";
import { db } from "../config";
import { emptyPaginatedData } from "@/lib/constants";

export const getAppActivities = async (
  page: number,
  limit: number,
  userId?: string
) => {
  try {
    return await prismaPaginate({
      page,
      limit,
      model: db.appActivity,
      args: {
        where: userId ? { userId } : {},
        orderBy: { createdAt: "desc" },
      },
    });
  } catch (error) {
    console.log("error fetching activities", error);

    return emptyPaginatedData;
  }
};

export const addAppActivity = async (title: string, description: string) => {
  try {
    return await db.appActivity.create({
      data: {
        title,
        description,
      },
    });
  } catch (e) {
    throw e;
    return null;
  }
};
