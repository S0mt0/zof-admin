"use client";
import { Calendar, Users, Star, Clock } from "lucide-react";

import { getEventsStats } from "@/lib/db/repository";
import { ActivityStats } from "@/components/activity-stats";

export function EventStats({
  completed,
  featured,
  total,
  upcoming,
}: Awaited<ReturnType<typeof getEventsStats>>) {
  const stats = [
    {
      title: "Total Events",
      value: total,
      icon: Calendar,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Upcoming",
      value: upcoming,
      icon: Clock,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: Users,
      gradient: "from-purple-400 to-purple-600",
    },
    {
      title: "Featured",
      value: featured,
      icon: Star,
      gradient: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <ActivityStats {...stat} key={idx} />
      ))}
    </div>
  );
}
