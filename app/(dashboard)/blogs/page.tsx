import { getAllBlogs, getBlogsStats } from "@/lib/db/repository";
import { Blogs } from "./_components/blog-page";
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

  const where: any = {};

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { excerpt: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  if (searchParams.status && searchParams.status !== "all") {
    where.status = searchParams.status;
  }

  if (searchParams.featured && searchParams.featured !== "all") {
    where.featured = searchParams.featured === "featured";
  }

  const [stats, blogsData] = await Promise.all([
    getBlogsStats(),
    getAllBlogs({
      page,
      limit,
      where,
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
