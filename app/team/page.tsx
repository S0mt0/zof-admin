import { listTeamMembers } from "@/lib/db/data";
import TeamPageClient from "./_components/team-page";

export default async function Page() {
  const members = await listTeamMembers();
  return <TeamPageClient members={members} />;
}
