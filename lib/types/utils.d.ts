type S3FileFolders = "profile" | "blogs" | "events" | "documents" | "media";

type PrismaPaginationOptions<M, A> = {
  page?: number;
  limit?: number;
  defaultLimit?: number;
  maxLimit?: number;
  args?: A; // model-specific findMany args like where/orderBy/include
  model: {
    count: (args?: any) => Promise<number>;
    findMany: (args?: any) => Promise<M[]>;
  };
};

interface Paginated<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
