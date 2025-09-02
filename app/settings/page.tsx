import { unstable_cache } from "next/cache";

import { getFoundationInfo, getWebsiteSettings } from "@/lib/db/repository";
import { DashboardHeader } from "@/components/dashboard-header";
import { FoundationInfo } from "./_components/foundation-info";
import { WebsiteSettings } from "./_components/website-settings";
import { Unauthorized } from "@/components/unauthorized";

import { currentUser } from "@/lib/utils";
import { EDITORIAL_ROLES } from "@/lib/constants";
import DashboardSettings from "./_components/dashboard-settings";

export default async function Page() {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  const getSettingsCached = unstable_cache(getWebsiteSettings, ["settings"], {
    tags: ["settings"],
    revalidate: 300,
  });

  const getInfoCached = unstable_cache(getFoundationInfo, ["info"], {
    tags: ["info"],
    revalidate: 300,
  });

  const foundationInfo = await getInfoCached();
  const websiteSettings = await getSettingsCached();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Settings" }]} />

      <div className="grid gap-6">
        <FoundationInfo foundationInfo={foundationInfo} />
        <WebsiteSettings websiteSettings={websiteSettings} />
        <DashboardSettings />
      </div>
    </div>
  );
}
