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

  return prismaPaginate({
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    },
  });
};

export const getBlogById = async (id: string) => {
  return db.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export const createBlog = async (data: any) => {
  return db.blog.create({
    data,
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export const updateBlog = async (id: string, data: any) => {
  return db.blog.update({
    where: { id },
    data,
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

export const deleteBlog = async (id: string) => {
  return db.blog.delete({
    where: { id },
  });
};

export const deleteManyBlogs = async (ids: string[]) => {
  return db.blog.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};
