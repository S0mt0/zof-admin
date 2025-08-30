import { unstable_cache } from "next/cache";
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

  const activityStats = unstable_cache(getAppStats, [user?.id!], {
    tags: ["profile-stats"],
    revalidate: false,
  });
  const { blogs, events, team } = await activityStats(user?.id);

  const getUser = unstable_cache(getUserById, [user?.id!], {
    tags: ["profile"],
    revalidate: false,
  });
  const profile = await getUser(user?.id!);

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
        {/* Profile Overview */}
        <ProfileOverview profile={profile!} />

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Activity Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <ActivityStats key={index} {...stat} />
            ))}
          </div>

          {/* Profile Information */}
          <ProfileInfo profile={profile!} />

          {/* Security Settings */}
          <SecuritySettings profile={profile!} />

          {/* Notification Preferences */}
          <NotificationPreferences profile={profile!} />

          {/* Delete Account */}
          <DeleteAccount userId={profile?.id!} />
        </div>
      </div>
    </div>
  );
}
