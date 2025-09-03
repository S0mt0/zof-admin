import { listTeamMembers } from "@/lib/db/repository";
import { TeamMembers } from "./_components/team-members";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function Page() {
  const members = await listTeamMembers();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Team Members" }]} />
      <TeamMembers members={members} />
    </div>
  );
}
