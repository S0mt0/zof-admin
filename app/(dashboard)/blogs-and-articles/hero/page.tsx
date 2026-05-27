import { DashboardHeader } from "@/components/common/dashboard-header";
import { getBlogsPageData } from "@/lib/db/repository/pages/blogs";

import { HeroSectionEditor } from "./_components/hero-section-editor";

export default async function BlogsHeroSection() {
  const data = await getBlogsPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Blogs" },
          { label: "Hero" },
        ]}
      />
      <HeroSectionEditor section={data.hero} />
    </div>
  );
}
