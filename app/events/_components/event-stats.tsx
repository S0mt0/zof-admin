"use client";
import { Calendar, Users, Star, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventStats({
  completed,
  featured,
  total,
  upcoming,
}: EventsStats) {
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
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div
              className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}
            >
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
