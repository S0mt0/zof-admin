import { DashboardHeader } from "@/components/common/dashboard-header";
import { getAboutPageData } from "@/lib/db/repository/pages/about";

import { HeroSectionEditor } from "./_components/hero-section-editor";

export default async function AboutHeroPage() {
  const data = await getAboutPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "Hero" },
        ]}
      />
      <HeroSectionEditor section={data.hero} />
    </div>
  );
}
