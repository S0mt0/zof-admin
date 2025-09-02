import { unstable_cache } from "next/cache";

import { listTeamMembers } from "@/lib/db/repository";
import { TeamMembers } from "./_components/team-members";
import { DashboardHeader } from "@/components/dashboard-header";

export const revalidate = 300; // revalidate segment every 5 minutes

export default async function Page() {
  const teamMembers = unstable_cache(listTeamMembers, ["teams"], {
    tags: ["teams"],
    revalidate: 300,
  });

  const members = await teamMembers();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Team Members" }]} />
      <TeamMembers members={members} />
    </div>
  );
}
