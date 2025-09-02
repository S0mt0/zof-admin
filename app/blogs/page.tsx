import { unstable_cache } from "next/cache";

import { getAllBlogs, getBlogsStats } from "@/lib/db/repository";
import { Blogs } from "./_components/blog-page";
import { BlogStats } from "./_components/blog-stats";
import { DashboardHeader } from "@/components/dashboard-header";

export const revalidate = 300; // revalidate segment every 5 minutes

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

  const getBlogsCached = unstable_cache(getAllBlogs, ["blogs"], {
    tags: ["blogs"],
    revalidate: 300,
  });

  const getBlogsStatsCached = unstable_cache(getBlogsStats, ["blogs-stats"], {
    tags: ["blogs-stats"],
    revalidate: 300,
  });

  const [stats, blogsData] = await Promise.all([
    getBlogsStatsCached(),
    getBlogsCached({
      page,
      limit,
      search: searchParams.search,
      status: searchParams.status,
      featured: searchParams.featured,
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Blog Posts" }]} />

      <BlogStats {...stats} />
      <Blogs {...blogsData} searchParams={searchParams} />
    </div>
  );
}
