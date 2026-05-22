import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages/landing";

import { ImpactSectionEditor } from "./_components/impact-section-editor";

export default async function LandingImpactPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Impact" },
        ]}
      />
      <ImpactSectionEditor section={data.impact} />
    </div>
  );
}
