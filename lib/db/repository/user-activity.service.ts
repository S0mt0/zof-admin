import { prismaPaginate } from "@/lib/utils/db.utils";
import { db } from "../config";

export const getRecentActivities = async (
  page: number,
  limit: number,
  userId: string
) => {
  return prismaPaginate({
    page,
    limit,
    model: db.userActivity,
    args: {
      where: { userId },
      orderBy: { createdAt: "desc" },
    },
  });
};
