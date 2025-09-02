import { DashboardHeader } from "@/components/dashboard-header";
import BlogForm from "../_components/blog-form/form";
import { Unauthorized } from "@/components/unauthorized";
import { currentUser } from "@/lib/utils";
import { EDITORIAL_ROLES } from "@/lib/constants";

export default async function NewBlogPostPage() {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

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
