import { DashboardHeader } from "@/components/common/dashboard-header";
import { getAboutPageData } from "@/lib/db/repository/pages/about";

import { TeamSectionEditor } from "./_components/team-section-editor";

export default async function AboutTeamPage() {
  const data = await getAboutPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "Team Section" },
        ]}
      />
      <TeamSectionEditor section={data.team} />
    </div>
  );
}
