export async function prismaPaginate<M, A = any>({
  page = 1,
  limit,
  defaultLimit = 10,
  maxLimit = 20,
  args = {} as A,
  model,
}: PrismaPaginationOptions<M, A>) {
  const cappedLimit = Math.min(limit || defaultLimit, maxLimit);
  const skip = (Math.max(page, 1) - 1) * cappedLimit;

  const [count, rows] = await Promise.all([
    model.count({ where: (args as any)?.where }),
    model.findMany({ ...(args as any), skip, take: cappedLimit }),
  ]);

  return {
    data: rows,
    pagination: {
      total: count,
      page: Math.max(page, 1),
      limit: cappedLimit,
      totalPages: Math.ceil(count / cappedLimit) || 1,
    },
  } as const;
}

export const allowedPublicBlogSelectFields = [
  "title",
  "excerpt",
  "slug",
  "publishedAt",
  "tags",
  "bannerImage",
] as const;

export type AllowedBlogSelectField =
  (typeof allowedPublicBlogSelectFields)[number];

export const allowedPublicEventSelectFields = [
  "name",
  "excerpt",
  "slug",
  "status",
  "date",
  "startTime",
  "endTime",
  "featured",
  "location",
  "bannerImage",
] as const;

export type AllowedEventSelectField =
  (typeof allowedPublicEventSelectFields)[number];
