type BlogStatus = "published" | "draft" | "scheduled";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  bannerImage: string | null;
  status: BlogStatus;
  featured: boolean;
  tags: string[];
  views: number;
  createdBy: string;
  authorId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  author?: Partial<IUser> | null;
}

interface BlogFiltersProps {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
  selectedCount: number;
  onBulkDelete: () => void;
}

interface BlogsTableProps {
  blogs: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
  };
}

interface BlogTableProps {
  blogs: Blog[];
  selectedBlogs: string[];
  onSelectBlog: (blogId: string) => void;
  onViewBlog: (blog: Blog) => void;
  onEditBlog: (blog: Blog) => void;
  onDeleteBlog: (blogId: string) => void;
}
