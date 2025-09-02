import { unstable_cache } from "next/cache";

import {
  getAllUsers,
  getFoundationInfo,
  getWebsiteSettings,
} from "@/lib/db/repository";
import { DashboardHeader } from "@/components/dashboard-header";
import { FoundationInfo } from "./_components/foundation-info";
import { WebsiteSettings } from "./_components/website-settings";
import { Unauthorized } from "@/components/unauthorized";

import { currentUser } from "@/lib/utils";
import { RolesSettings } from "./_components/roles-settings";
import { DeleteUsersAccount } from "./_components/delete-user-account";

export const revalidate = 300; // revalidate segment every 5 minutes

export default async function Page() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return <Unauthorized />;

  const getSettingsCached = unstable_cache(getWebsiteSettings, ["settings"], {
    tags: ["settings"],
    revalidate: 300,
  });

  const getInfoCached = unstable_cache(getFoundationInfo, ["info"], {
    tags: ["info"],
    revalidate: 300,
  });

  const getAllUsersCached = unstable_cache(getAllUsers, ["users"], {
    tags: ["users"],
    revalidate: 300,
  });

  const [info, settings, users] = await Promise.all([
    getInfoCached(),
    getSettingsCached(),
    getAllUsersCached({ where: { id: { not: user.id } } }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Settings" }]} />

      <div className="grid gap-6 @container">
        <FoundationInfo foundationInfo={info} />
        <WebsiteSettings websiteSettings={settings} />

        <div className="grid lg:grid-cols-2 gap-4">
          <RolesSettings users={users} />
          <DeleteUsersAccount users={users} />
        </div>
      </div>
    </div>
  );
}
