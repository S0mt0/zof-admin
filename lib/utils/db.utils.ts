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
