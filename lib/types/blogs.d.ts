type BlogStatus = "published" | "draft" | "scheduled";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  bannerImage: string;
  status: BlogStatus;
  featured: boolean;
  tags: string[];
  comments?: IComment[];
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
  isPending: boolean;
}

interface BlogsTableProps extends Paginated<Blog> {
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
  isPending: boolean;
  onSelectBlog: (blogId: string) => void;
  onViewBlog: (blog: Blog) => void;
  onEditBlog: (blog: Blog) => void;
  onDeleteBlog: (blogId: string) => void;
}

interface BlogTableWrapperProps extends Paginated<Blog> {
  selectedBlogs: string[];
  onSelectBlog: (blogId: string) => void;
  onSelectAll: () => void;
  onViewBlog: (blog: Blog) => void;
  onEditBlog: (blog: Blog) => void;
  onDeleteBlog: (blogId: string) => void;
  isPending: boolean;
  allCurrentSelected: boolean;
  someCurrentSelected: boolean;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
}
