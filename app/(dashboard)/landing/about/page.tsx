import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages.service";

import { AboutSectionEditor } from "./_components/about-section-editor";

export default async function LandingAboutPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Who We Are" },
        ]}
      />
      <AboutSectionEditor section={data.about} />
    </div>
  );
}
