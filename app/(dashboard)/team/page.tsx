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

/*
Zita Onyeka
(Founder & CEO)
Zita Onyeka is a business leader and devoted mother driven by a profound commitment to helping others. She channels this passion into action through the Zita-Onyeka Foundation, which she founded to serve and empower her community.
 */

/*
Ezinne Francis
(Secretary )
Ezinne Francis is the Secretary of the Zita-Onyeka Foundation, where she provides essential administrative support. Her dedication to teamwork and organization helps the foundation achieve its goals of supporting those in need.
*/
