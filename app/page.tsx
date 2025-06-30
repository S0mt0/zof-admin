"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Users, MessageSquare } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

const stats = [
  {
    title: "Total Blog Posts",
    value: "24",
    description: "+2 from last month",
    icon: FileText,
    gradient: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Upcoming Events",
    value: "8",
    description: "3 this month",
    icon: Calendar,
    gradient: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Team Members",
    value: "12",
    description: "Active members",
    icon: Users,
    gradient: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Messages",
    value: "47",
    description: "12 unread",
    icon: MessageSquare,
    gradient: "from-pink-400 to-pink-600",
    bgColor: "bg-pink-50",
  },
];

// Extended recent activity data for pagination testing
const allRecentActivity = [
  {
    action: "New blog post published",
    title: "Community Outreach Program Success",
    time: "2 hours ago",
  },
  {
    action: "Event created",
    title: "Annual Fundraising Gala 2024",
    time: "5 hours ago",
  },
  {
    action: "Team member added",
    title: "Sarah Johnson joined as Program Coordinator",
    time: "1 day ago",
  },
  {
    action: "Blog post updated",
    title: "Education Initiative Impact Report",
    time: "2 days ago",
  },
  {
    action: "New donation received",
    title: "$500 donation from Anonymous donor",
    time: "3 days ago",
  },
  {
    action: "Event completed",
    title: "Volunteer Training Session completed successfully",
    time: "4 days ago",
  },
  {
    action: "Message received",
    title: "Partnership inquiry from Local Business",
    time: "5 days ago",
  },
  {
    action: "Blog post published",
    title: "Monthly Newsletter - January 2024",
    time: "1 week ago",
  },
  {
    action: "Team member updated",
    title: "Mike Chen promoted to Senior Coordinator",
    time: "1 week ago",
  },
  {
    action: "Event scheduled",
    title: "Youth Mentorship Program Launch scheduled",
    time: "1 week ago",
  },
  {
    action: "New volunteer registered",
    title: "John Doe registered as a volunteer",
    time: "1 week ago",
  },
  {
    action: "Donation processed",
    title: "$250 monthly donation from recurring donor",
    time: "2 weeks ago",
  },
  {
    action: "Event reminder sent",
    title: "Reminder sent for upcoming health workshop",
    time: "2 weeks ago",
  },
  {
    action: "Blog post drafted",
    title: "Annual report draft completed",
    time: "2 weeks ago",
  },
  {
    action: "Partnership established",
    title: "New partnership with Local University",
    time: "3 weeks ago",
  },
  {
    action: "Grant application submitted",
    title: "Education grant application submitted",
    time: "3 weeks ago",
  },
  {
    action: "Volunteer training completed",
    title: "15 volunteers completed training program",
    time: "3 weeks ago",
  },
  {
    action: "Event feedback received",
    title: "Positive feedback from community workshop",
    time: "1 month ago",
  },
  {
    action: "New team member onboarded",
    title: "Dr. Emily Rodriguez joined as Health Coordinator",
    time: "1 month ago",
  },
  {
    action: "Fundraising milestone reached",
    title: "Reached 75% of annual fundraising goal",
    time: "1 month ago",
  },
];

const quickActions = [
  {
    title: "Create New Blog Post",
    icon: FileText,
    gradient: "from-blue-400 to-blue-600",
    hoverBg: "hover:bg-blue-50",
    iconBg: "bg-blue-100",
    iconHoverBg: "group-hover:bg-blue-200",
    href: "/blogs/new",
  },
  {
    title: "Add New Event",
    icon: Calendar,
    gradient: "from-emerald-400 to-emerald-600",
    hoverBg: "hover:bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconHoverBg: "group-hover:bg-emerald-200",
    href: "/events/new",
  },
  {
    title: "Add Team Member",
    icon: Users,
    gradient: "from-purple-400 to-purple-600",
    hoverBg: "hover:bg-purple-50",
    iconBg: "bg-purple-100",
    iconHoverBg: "group-hover:bg-purple-200",
    href: "/team/new",
  },
  {
    title: "View Messages",
    icon: MessageSquare,
    gradient: "from-pink-400 to-pink-600",
    hoverBg: "hover:bg-pink-50",
    iconBg: "bg-pink-100",
    iconHoverBg: "group-hover:bg-pink-200",
    href: "/messages",
  },
];

const ITEMS_PER_PAGE = 5;

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allRecentActivity.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentActivities = allRecentActivity.slice(startIndex, endIndex);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-105`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentActivities.map((activity, index) => (
                <div
                  key={startIndex + index}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.title}</p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingStart={startIndex + 1}
              showingEnd={Math.min(endIndex, allRecentActivity.length)}
              totalItems={allRecentActivity.length}
              itemName="activities"
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div
                  className={`w-full text-left p-3 rounded-lg border ${action.hoverBg} transition-all duration-200 group hover:shadow-md hover:border-opacity-50 cursor-pointer`}
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
      </div>
    </div>
  );
}
