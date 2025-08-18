import { currentUser } from "@/lib/utils";
import { ProfilePage } from "./_components/profile-page";
import { db } from "@/lib/db";

export default async function Page() {
  const user = await currentUser();
  const profile = await db.user.findUnique({ where: { id: user?.id } });
  const blogsCount = await db.blog.count({ where: { createdBy: user?.id } });
  const eventsCount = await db.event.count({ where: { createdBy: user?.id } });
  const teamMembersCount = await db.teamMember.count({
    where: { addedBy: user?.id },
  });

  return (
    <ProfilePage
      profile={profile!}
      numberOfBlogs={blogsCount}
      numberOfEvents={eventsCount}
      numberOfTeamMembers={teamMembersCount}
    />
  );
}
