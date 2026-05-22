import { getWebsiteSettings } from "@/lib/db/repository/settings.service";
import { getAllUsers } from "@/lib/db/repository/user.service";
import { DashboardHeader } from "@/components/common/dashboard-header";
import { WebsiteSettings } from "./_components/website-settings";
import { RolesSettings } from "./_components/roles-settings";
import { Unauthorized } from "@/components/common/unauthorized";

import { currentUser } from "@/lib/utils";

export default async function Page() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return <Unauthorized />;

  const settings = await getWebsiteSettings();
  const users = await getAllUsers();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Settings" }]} />

      <div className="grid gap-6 @container">
        <WebsiteSettings websiteSettings={settings} />
        <RolesSettings users={users} currentUserId={user.id} />
      </div>
    </div>
  );
}
