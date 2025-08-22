import { unstable_cache } from "next/cache";

import { getBlogs } from "@/lib/db/repository";
import { Blogs } from "./_components/blog";
import { currentUser } from "@/lib/utils";
import { BlogStats } from "./_components/blog-stats";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const getBlogsCached = unstable_cache(
    getBlogs,
    [
      "blogs",
      page.toString(),
      limit.toString(),
      searchParams.search || "",
      searchParams.status || "",
      searchParams.featured || "",
      searchParams.limit || "",
    ],
    {
      tags: ["blogs"],
      revalidate: false,
    }
  );

  const user = await currentUser();

  const { data: blogs, pagination } = await getBlogsCached(
    user?.id!,
    page,
    limit,
    searchParams.search,
    searchParams.status,
    searchParams.featured
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Blog Posts"
        breadcrumbs={[{ label: "Blog Posts" }]}
      />

      <BlogStats blogs={blogs} />

      <Blogs
        blogs={blogs}
        pagination={pagination}
        searchParams={searchParams}
      />
    </div>
  );
}
