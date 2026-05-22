import { DashboardHeader } from "@/components/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages.service";
import { listVolunteers } from "@/lib/db/repository/team.service";
import { LandingSectionEditor } from "../_components/landing-section-editor";

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
      <LandingSectionEditor
        section="volunteers"
        data={data}
        volunteers={volunteers}
      />
    </div>
  );
}
