import { listTeamMembers } from "@/lib/db/repository";
import TeamPageClient from "./_components/team-page";

export default async function Page() {
  const members = await listTeamMembers();
  return <TeamPageClient members={members} />;
}
