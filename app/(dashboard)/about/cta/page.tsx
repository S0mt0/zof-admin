import { DashboardHeader } from "@/components/common/dashboard-header";
import { getAboutPageData } from "@/lib/db/repository/pages/about";

import { CtaSectionEditor } from "./_components/cta-section-editor";

export default async function AboutCtaPage() {
  const data = await getAboutPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "CTA" },
        ]}
      />
      <CtaSectionEditor section={data.cta} />
    </div>
  );
}
