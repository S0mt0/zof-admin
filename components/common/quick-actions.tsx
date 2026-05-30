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
    title: "Manage Blogs & Articles",
    icon: FileText,
    href: "/blogs-and-articles/manage",
  },
  {
    title: "Manage Events & Programmes",
    icon: Calendar,
    href: "/events-and-programmes/manage",
  },
  {
    title: "Manage Team Member & Volunteers",
    icon: Users,
    href: "/about/team",
  },
  {
    title: "View Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Manage Donations & Campaigns",
    icon: FileText,
    href: "/donations/manage",
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
            <div className="w-full cursor-pointer rounded-lg border border-border/80 p-3 text-left transition-colors duration-200 group hover:border-primary/25 hover:bg-muted/35">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-colors duration-200 group-hover:border-primary/30 group-hover:text-primary">
                  <action.icon className="h-5 w-5" />
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
