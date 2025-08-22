import { unstable_cache } from "next/cache";

import { currentUser } from "@/lib/utils";
import { ProfilePage } from "./_components/profile-page";
import { getActivityStats, getUserById } from "@/lib/db/repository";

export default async function Page() {
  const user = await currentUser();

  const activityStats = unstable_cache(getActivityStats, [user?.id!], {
    tags: ["user-activity-stats"],
    revalidate: false,
  });
  const stats = await activityStats(user?.id);

  const getUser = unstable_cache(getUserById, [user?.id!], {
    tags: ["profile"],
    revalidate: false,
  });
  const profile = await getUser(user?.id!);

  return <ProfilePage profile={profile!} {...stats} />;
}
