import { Prisma } from "@prisma/client";

import { emptyPaginatedData } from "@/lib/constants";
import { db } from "../config";
import { prismaPaginate } from "@/lib/utils/db.utils";

interface ListBlogsOptions {
  where?: Prisma.BlogWhereInput;
  select?: Prisma.BlogSelect;
  include?: Prisma.BlogInclude;
  orderBy?: Prisma.BlogOrderByWithRelationInput;
  page: number;
  limit: number;
}

export const getAllBlogs = async ({
  where,
  select,
  orderBy = { createdAt: "desc" },
  page,
  limit,
}: ListBlogsOptions) => {
  try {
    return await prismaPaginate({
      page,
      limit,
      model: db.blog,
      args: {
        where,
        orderBy,
        ...(select
          ? { select }
          : {
              include: {
                author: {
                  select: {
                    name: true,
                    image: true,
                    email: true,
                    emailNotifications: true,
                  },
                },
              },
            }),
      },
    });
  } catch (error) {
    console.log("error fetching all blogs", error);
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
            emailNotifications: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error getting blog", error);
    return null;
  }
};

export const getBlogByTitle = async (title: string) => {
  try {
    return await db.blog.findUnique({
      where: { title },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
            emailNotifications: true,
          },
        },
        comments: {
          select: {
            authorName: true,
            authorEmail: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error getting blog", error);
    return null;
  }
};

export const getBlogBySlug = async (slug: string) => {
  try {
    return await db.blog.findFirst({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
            emailNotifications: true,
          },
        },
        comments: {
          select: {
            authorName: true,
            authorEmail: true,
            comment: true,
            createdAt: true,
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
    });
  } catch (error) {
    console.log("error creating blog", error);
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
            emailNotifications: true,
          },
        },
      },
    });
  } catch (error) {
    console.log("error updating blog", error);
    return null;
  }
};

export const updateBlogBySlug = async (slug: string, data: any) => {
  try {
    return await db.blog.update({
      where: { slug },
      data,
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
            emailNotifications: true,
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
      include: {
        author: {
          select: {
            name: true,
            image: true,
            email: true,
            emailNotifications: true,
          },
        },
      },
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
