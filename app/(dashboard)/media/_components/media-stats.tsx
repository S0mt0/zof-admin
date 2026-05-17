"use client";

import { Film, ImageIcon, Library } from "lucide-react";

import { ActivityStats } from "@/components/activity-stats";
import { getMediaStats } from "@/lib/db/repository";

export function MediaStats({
  photos,
  total,
  videos,
}: Awaited<ReturnType<typeof getMediaStats>>) {
  const stats = [
    {
      title: "Library Items",
      value: total,
      icon: Library,
      gradient: "from-sky-400 to-sky-600",
    },
    {
      title: "Photos",
      value: photos,
      icon: ImageIcon,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Videos",
      value: videos,
      icon: Film,
      gradient: "from-orange-400 to-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <ActivityStats key={index} {...stat} />
      ))}
    </div>
  );
}
