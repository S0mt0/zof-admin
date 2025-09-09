import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getAllBlogs } from "@/lib/db/repository";
import {
  allowedPublicBlogSelectFields,
  AllowedBlogSelectField,
} from "@/lib/utils";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || undefined;
  const fields = searchParams.get("fields") || undefined;
  const featured = searchParams.get("featured") || "all";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const where: Prisma.BlogWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (featured && featured !== "all") {
    where.featured = featured === "featured";
  }

  // --- Type-safe select builder ---
  let select: Prisma.BlogSelect | undefined = undefined;

  if (fields) {
    const requestedFields = fields.split(",") as AllowedBlogSelectField[];

    const validFields = requestedFields.filter((field) =>
      allowedPublicBlogSelectFields.includes(field)
    );

    if (validFields.length > 0) {
      select = validFields.reduce<Prisma.BlogSelect>((prev, field) => {
        prev[field] = true;
        return prev;
      }, {});
    }
  }

  try {
    const { data, pagination } = await getAllBlogs({
      page,
      limit,
      where: { ...where, status: "published" },
      select,
    });

    return Response.json(
      { message: "Blogs fetched successfully", data, pagination },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      {
        headers: {
          "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        status: 500,
      }
    );
  }
}
