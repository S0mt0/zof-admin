import { DashboardHeader } from "@/components/common/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages/landing";
import { listVolunteers } from "@/lib/db/repository/team.service";

import { VolunteersSectionEditor } from "./_components/volunteers-section-editor";

export default async function LandingVolunteersPage() {
  const [data, volunteers] = await Promise.all([
    getLandingPageData(),
    listVolunteers(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Volunteers" },
        ]}
      />
      <VolunteersSectionEditor
        section={data.volunteers}
        volunteers={volunteers}
      />
    </div>
  );
}
