import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages/landing";

import { HeroSectionEditor } from "./_components/hero-section-editor";

export default async function LandingHeroPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Hero" },
        ]}
      />
      <HeroSectionEditor hero={data.hero} />
    </div>
  );
}
