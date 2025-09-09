type CommentStatus = "approved" | "rejected" | "pending";

interface IBlogComment {
  id: string;
  status: CommentStatus;
  comment: string;
  authorName: string;
  authorEmail: string;
  blogId: string;
  blog?: Blog;
  createdAt: Date;
  updatedAt: Date;
}

interface IEventComment {
  id: string;
  status: CommentStatus;
  comment: string;
  authorName: string;
  authorEmail: string;
  eventId: string;
  event?: Blog;
  createdAt: Date;
  updatedAt: Date;
}
