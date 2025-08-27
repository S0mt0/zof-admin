import { DashboardHeader } from "@/components/dashboard-header";
import BlogForm from "../../_components/blog-form/form";
import { getBlogBySlug } from "@/lib/db/repository";
import { BlogNotFound } from "../../_components/not-found";

interface EditBlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) return <BlogNotFound />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title={`Edit: ${blog.title}`}
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: "Edit Post" },
        ]}
      />
      <BlogForm mode="edit" initialData={blog} />
    </div>
  );
}
