import { DashboardHeader } from "@/components/common/dashboard-header";
import { getAboutPageData } from "@/lib/db/repository/pages/about";

import { FounderMessageSectionEditor } from "./_components/founder-message-section-editor";

export default async function AboutFounderMessagePage() {
  const data = await getAboutPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "Founder Message" },
        ]}
      />
      <FounderMessageSectionEditor section={data.foundersMessage} />
    </div>
  );
}
