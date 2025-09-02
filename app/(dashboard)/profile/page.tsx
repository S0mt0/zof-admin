import { User, Calendar, Edit3 } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard-header";
import { currentUser } from "@/lib/utils";
import { getAppStats, getUserById } from "@/lib/db/repository";
import { ProfileOverview } from "./_components/profile-overview";
import { ActivityStats } from "@/components/activity-stats";
import { ProfileInfo } from "./_components/profile-info";
import { SecuritySettings } from "./_components/security-settings";
import { NotificationPreferences } from "./_components/notification-preferences";
import { DeleteAccount } from "./_components/delete-account";

export default async function Page() {
  const user = await currentUser();

  const [{ blogs, events, team }, profile] = await Promise.all([
    getAppStats(user?.id),
    getUserById(user?.id!),
  ]);

  const stats = [
    {
      title: "Blog Posts Created",
      value: blogs,
      icon: Edit3,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Events Managed",
      value: events,
      icon: Calendar,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Team Members Added",
      value: team,
      icon: User,
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Profile" }]} />

      <div className="grid gap-6 md:grid-cols-3">
        <ProfileOverview profile={profile!} />

        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <ActivityStats key={index} {...stat} />
            ))}
          </div>

          <ProfileInfo profile={profile!} />

          <SecuritySettings profile={profile!} />

          <NotificationPreferences profile={profile!} />

          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
