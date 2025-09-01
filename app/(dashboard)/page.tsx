import { FileText, Calendar, Users, MessageSquare } from "lucide-react";
import { unstable_cache } from "next/cache";

import { DashboardHeader } from "@/components/dashboard-header";
import { ActivityStats } from "@/components/activity-stats";
import { QuickActions } from "./_components/quick-actions";
import { UsersRecentActivities } from "./_components/recent-activities";
import { getAppStats } from "@/lib/db/repository";

export const revalidate = 300;

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const activityStats = unstable_cache(getAppStats, ["app-stats"], {
    tags: ["app-stats"],
    revalidate: 300, // revalidate every 5 minutes
  });
  const { blogs, events, team, messages } = await activityStats();

  const cards = [
    {
      title: "Total Blog Posts",
      value: blogs,
      icon: FileText,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Total Events",
      value: events,
      icon: Calendar,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Team Members",
      value: team,
      icon: Users,
      gradient: "from-purple-400 to-purple-600",
    },
    {
      title: "Messages",
      value: messages,
      icon: MessageSquare,
      gradient: "from-pink-400 to-pink-600",
    },
  ];

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 5;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <ActivityStats key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <UsersRecentActivities page={page} limit={limit} />
        <QuickActions />
      </div>
    </div>
  );
}
