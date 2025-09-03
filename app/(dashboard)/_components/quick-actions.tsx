"use client";

import Link from "next/link";
import { FileText, Calendar, Users, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const quickActions = [
  {
    title: "Create New Blog Post",
    icon: FileText,
    gradient: "from-blue-400 to-blue-600",
    hoverBg: "hover:bg-blue-50/40",
    href: "/blogs/new",
  },
  {
    title: "Add New Event",
    icon: Calendar,
    gradient: "from-emerald-400 to-emerald-600",
    hoverBg: "hover:bg-emerald-50/40",
    href: "/events/new",
  },
  {
    title: "Add Team Member",
    icon: Users,
    gradient: "from-purple-400 to-purple-600",
    hoverBg: "hover:bg-purple-50/40",
    href: "/team/new",
  },
  {
    title: "View Messages",
    icon: MessageSquare,
    gradient: "from-pink-400 to-pink-600",
    hoverBg: "hover:bg-pink-50/40",
    href: "/messages",
  },
];

export function QuickActions() {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div
              className={`w-full text-left p-3 rounded-lg border ${action.hoverBg} transition-all duration-200 group hover:shadow-md cursor-pointer`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`h-10 w-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105`}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">{action.title}</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
