import { DashboardHeader } from "@/components/common/dashboard-header";
import { getEventsPageData } from "@/lib/db/repository/pages/events";

import { HeroSectionEditor } from "./_components/hero-section-editor";

export default async function EventsHeroSection() {
  const data = await getEventsPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Events & Articles" },
          { label: "Hero" },
        ]}
      />
      <HeroSectionEditor section={data.hero} />
    </div>
  );
}
