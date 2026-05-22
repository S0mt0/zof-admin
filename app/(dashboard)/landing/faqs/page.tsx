import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages.service";

import { FaqsSectionEditor } from "./_components/faqs-section-editor";

export default async function LandingFaqsPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "FAQs" },
        ]}
      />
      <FaqsSectionEditor section={data.faqs} />
    </div>
  );
}
