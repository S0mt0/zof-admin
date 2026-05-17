import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { listMedia } from "@/lib/db/repository/media.service";
import {
  AllowedMediaSelectField,
  allowedPublicMediaSelectFields,
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
  const type = searchParams.get("type") || "all";
  const fields = searchParams.get("fields") || undefined;

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  const where: Prisma.MediaWhereInput = {};

  if (search) {
    where.OR = [
      { alt: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { caption: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (type && type !== "all" && ["photo", "video"].includes(type)) {
    where.type = type as Prisma.EnumMediaTypeFilter<"Media">;
  }

  // --- Type-safe select builder ---
  let select: Prisma.MediaSelect | undefined = undefined;

  if (fields) {
    const requestedFields = fields.split(",") as AllowedMediaSelectField[];

    const validFields = requestedFields.filter((field) =>
      allowedPublicMediaSelectFields.includes(field)
    );

    if (validFields.length > 0) {
      select = validFields.reduce<Prisma.MediaSelect>((prev, field) => {
        prev[field] = true;
        return prev;
      }, {});
    }
  }

  try {
    const { data, pagination } = await listMedia({
      page,
      limit,
      where,
      select,
    });

    return Response.json(
      { message: "Media fetched successfully", data, pagination },
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
    console.error("Error fetching media:", error);

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
