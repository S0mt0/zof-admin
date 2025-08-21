import { unstable_cache } from "next/cache";

import { getBlogs } from "@/lib/db/repository";
import { BlogPage } from "./_components/blog-page";
import { currentUser } from "@/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;

  const getBlogsCached = unstable_cache(
    getBlogs,
    [
      "blogs",
      page.toString(),
      limit.toString(),
      searchParams.search || "",
      searchParams.status || "",
      searchParams.featured || "",
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
    <BlogPage
      blogs={blogs}
      pagination={pagination}
      searchParams={searchParams}
    />
  );
}
