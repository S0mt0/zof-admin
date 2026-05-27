import { DashboardHeader } from "@/components/common/dashboard-header";
import { listVolunteers } from "@/lib/db/repository/team.service";
import { Volunteers } from "./_components/volunteers";

export default async function VolunteersPage() {
  const volunteers = await listVolunteers();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "Volunteers" },
        ]}
      />
      <Volunteers volunteers={volunteers} />
    </div>
  );
}
