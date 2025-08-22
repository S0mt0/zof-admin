import { currentUser } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import BlogForm from "../../_components/blog-form";
import { getBlogById } from "@/lib/db/repository";
import { notFound } from "next/navigation";

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const user = await currentUser();
  const blog = await getBlogById(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title={`Edit: ${blog.title}`}
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: "Edit Post" },
        ]}
      />
      <BlogForm mode="edit" initialData={blog} userId={user?.id || ""} />
    </div>
  );
}
