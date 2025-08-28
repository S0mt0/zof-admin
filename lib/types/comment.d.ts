interface IComment {
  id: string;
  comment: string;
  authorName: string;
  authorEmail: string;
  blogId: string;
  blog?: Blog;
  createdAt: Date;
  updatedAt: Date;
}
