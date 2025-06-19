import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Users, Eye, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Blog Posts",
    value: "24",
    description: "+2 from last month",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    title: "Upcoming Events",
    value: "8",
    description: "3 this month",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Team Members",
    value: "12",
    description: "Active members",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Page Views",
    value: "2,847",
    description: "+12% from last month",
    icon: Eye,
    color: "text-orange-600",
  },
]

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
]

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
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
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Create New Blog Post</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="font-medium">Add New Event</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Add Team Member</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="font-medium">View Analytics</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
