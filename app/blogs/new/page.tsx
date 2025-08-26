import { DashboardHeader } from "@/components/dashboard-header";
import BlogForm from "../_components/blog-form/form";

export default async function NewBlogPostPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Create New Blog Post"
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: "New Post" },
        ]}
      />
      <BlogForm mode="create" />
    </div>
  );
}
