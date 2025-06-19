import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Calendar, Users, MessageSquare } from "lucide-react";

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

const recentActivity = [
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
];

const quickActions = [
  {
    title: "Create New Blog Post",
    icon: FileText,
    gradient: "from-blue-400 to-blue-600",
    hoverBg: "hover:bg-blue-50",
    iconBg: "bg-blue-100",
    iconHoverBg: "group-hover:bg-blue-200",
  },
  {
    title: "Add New Event",
    icon: Calendar,
    gradient: "from-emerald-400 to-emerald-600",
    hoverBg: "hover:bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconHoverBg: "group-hover:bg-emerald-200",
  },
  {
    title: "Add Team Member",
    icon: Users,
    gradient: "from-purple-400 to-purple-600",
    hoverBg: "hover:bg-purple-50",
    iconBg: "bg-purple-100",
    iconHoverBg: "group-hover:bg-purple-200",
  },
  {
    title: "View Messages",
    icon: MessageSquare,
    gradient: "from-pink-400 to-pink-600",
    hoverBg: "hover:bg-pink-50",
    iconBg: "bg-pink-100",
    iconHoverBg: "group-hover:bg-pink-200",
  },
];

export default function Dashboard() {
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
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
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
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                className={`w-full text-left p-3 rounded-lg border ${action.hoverBg} transition-all duration-200 group hover:shadow-md hover:border-opacity-50`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105`}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
