"use client";

import { FileText, Eye, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BlogStats({ draft, featured, published, total }: BlogsStats) {
  const stats = [
    {
      title: "Total Posts",
      value: total,
      icon: FileText,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Published",
      value: published,
      icon: Eye,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Drafts",
      value: draft,
      icon: Clock,
      gradient: "from-amber-400 to-amber-600",
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
