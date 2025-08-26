"use client";

import { FileText, Eye, Star, Clock } from "lucide-react";

import { ActivityStats } from "@/components/activity-stats";

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
      {stats.map((stat, idx) => (
        <ActivityStats {...stat} key={idx} />
      ))}
    </div>
  );
}
