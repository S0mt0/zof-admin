import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import { currentUser } from "@/lib/utils";
import { EDITORIAL_ROLES } from "@/lib/constants";
import BlogForm from "../_components/blog-form/form";

export default async function NewBlogPostPage() {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Blog & Articles", href: "/blogs-and-articles/manage" },
          { label: "New Post" },
        ]}
      />
      <BlogForm mode="create" />
    </div>
  );
}
