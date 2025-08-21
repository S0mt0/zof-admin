"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Star, Clock } from "lucide-react";

interface BlogStatsProps {
  blogs: Blog[];
}

export function BlogStats({ blogs }: BlogStatsProps) {
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter(
    (blog) => blog.status === "published"
  ).length;
  const draftBlogs = blogs.filter((blog) => blog.status === "draft").length;
  const featuredBlogs = blogs.filter((blog) => blog.featured).length;
  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);

  const stats = [
    {
      title: "Total Posts",
      value: totalBlogs,
      icon: FileText,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Published",
      value: publishedBlogs,
      icon: Eye,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Drafts",
      value: draftBlogs,
      icon: Clock,
      gradient: "from-amber-400 to-amber-600",
    },
    {
      title: "Featured",
      value: featuredBlogs,
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
            {stat.title === "Total Posts" && (
              <p className="text-xs text-muted-foreground">
                {totalViews} total views
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
