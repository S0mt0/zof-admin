import { DashboardHeader } from "@/components/common/dashboard-header";
import { getGalleryPageData } from "@/lib/db/repository/pages/gallery";

import { HeroSectionEditor } from "./_components/hero-section-editor";

export default async function GalleryHeroSection() {
  const data = await getGalleryPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Gallery", href: "/media/manage" },
          { label: "Hero" },
        ]}
      />
      <HeroSectionEditor section={data.hero} />
    </div>
  );
}
