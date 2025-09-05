import { type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getAllEvents } from "@/lib/db/repository";
import {
  AllowedEventSelectField,
  allowedPublicEventSelectFields,
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
  const status = (searchParams.get("status") || "upcoming") as EventStatus;
  const featured = searchParams.get("featured") || "all";
  const fields = searchParams.get("fields") || undefined;
  const search = searchParams.get("search") || undefined;

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const where: Prisma.EventWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (featured && featured !== "all") {
    where.featured = featured === "featured";
  }

  // --- Type-safe select builder ---
  let select: Prisma.EventSelect | undefined = undefined;

  if (fields) {
    const requestedFields = fields.split(",") as AllowedEventSelectField[];

    const validFields = requestedFields.filter((field) =>
      allowedPublicEventSelectFields.includes(field)
    );

    if (validFields.length > 0) {
      select = validFields.reduce<Prisma.EventSelect>((prev, field) => {
        prev[field] = true;
        return prev;
      }, {});
    }
  }

  try {
    const { data, pagination } = await getAllEvents({
      page,
      limit,
      where: { ...where, status },
      select,
    });

    return Response.json(
      { message: "Events fetched successfully", data, pagination },
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
    console.error("Error fetching events:", error);

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
