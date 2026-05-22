import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages/landing";

import { FeaturedBlogsSectionEditor } from "./_components/featured-blogs-section-editor";

export default async function LandingFeaturedBlogsPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Featured Blogs" },
        ]}
      />
      <FeaturedBlogsSectionEditor section={data.featuredBlogs} />
    </div>
  );
}
