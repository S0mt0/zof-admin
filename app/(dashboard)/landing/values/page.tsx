import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages/landing";

import { ValuesSectionEditor } from "./_components/values-section-editor";

export default async function LandingValuesPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Values" },
        ]}
      />
      <ValuesSectionEditor section={data.values} />
    </div>
  );
}
