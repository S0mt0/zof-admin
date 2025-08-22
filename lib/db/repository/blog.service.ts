import { emptyPaginatedData } from "@/lib/constants";
import { db } from "../config";
import { prismaPaginate } from "@/lib/utils/db.utils";

export const getBlogs = async (
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
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (featured && featured !== "all") {
    where.featured = featured === "featured";
  }

  try {
    return await prismaPaginate({
      page,
      limit,
      model: db.blog,
      args: {
        where,
        include: {
          author: {
            select: {
              name: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    });
  } catch (error) {
    console.log("error fetching blogs", error);
    return emptyPaginatedData;
  }
};

export const getBlogById = async (id: string) => {
  try {
    return await db.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error getting blog", error);
    return null;
  }
};

export const createBlog = async (data: any) => {
  try {
    return await db.blog.create({
      data,
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error getting blog", error);
    return null;
  }
};

export const updateBlog = async (id: string, data: any) => {
  try {
    return await db.blog.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error updating blog", error);
    return null;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    return await db.blog.delete({
      where: { id },
    });
  } catch (error) {
    console.log("error deleting blog", error);
    return null;
  }
};

export const deleteManyBlogs = async (ids: string[]) => {
  try {
    return await db.blog.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  } catch (error) {
    console.log("error deleting blogs", error);
    return null;
  }
};
