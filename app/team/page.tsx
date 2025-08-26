import { unstable_cache } from "next/cache";

import { listTeamMembers } from "@/lib/db/repository";
import TeamPageClient from "./_components/team-page";

export default async function Page() {
  const teamMembers = unstable_cache(listTeamMembers, ["teams"], {
    tags: ["teams"],
    revalidate: 300, // revalidate every 5 mimnutes
  });
  const members = await teamMembers();

  return <TeamPageClient members={members} />;
}
