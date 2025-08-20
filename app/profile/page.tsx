import { cache } from "react";

import { currentUser } from "@/lib/utils";
import { ProfilePage } from "./_components/profile-page";
import { getUserActivityStats, getUserById } from "@/lib/db/repository";

export default async function Page() {
  const user = await currentUser();

  const fetchUser = cache(getUserById);
  const cachedUser = await fetchUser(user?.id!);

  const fetchStats = cache(getUserActivityStats);
  const cachedStats = await fetchStats(user?.id!);

  return <ProfilePage profile={cachedUser!} {...cachedStats} />;
}
