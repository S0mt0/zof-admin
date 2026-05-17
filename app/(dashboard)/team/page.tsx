import {
  listTeamMembers,
  listVolunteers,
} from "@/lib/db/repository/team.service";
import { TeamMembers } from "./_components/team-members";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function Page() {
  const [members, volunteers] = await Promise.all([
    listTeamMembers(),
    listVolunteers(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Team Members" }]} />
      <TeamMembers members={members} volunteers={volunteers} />
    </div>
  );
}
