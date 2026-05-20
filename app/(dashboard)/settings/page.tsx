import { getWebsiteSettings } from "@/lib/db/repository/settings.service";
import { DashboardHeader } from "@/components/dashboard-header";
import { WebsiteSettings } from "./_components/website-settings";
import { Unauthorized } from "@/components/unauthorized";

import { currentUser } from "@/lib/utils";

export default async function Page() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return <Unauthorized />;

  const settings = await getWebsiteSettings();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Settings" }]} />

      <div className="grid gap-6 @container">
        <WebsiteSettings websiteSettings={settings} />
      </div>
    </div>
  );
}
