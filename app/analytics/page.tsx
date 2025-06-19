import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Eye, Calendar, MessageSquare } from "lucide-react"

const analyticsData = [
  {
    title: "Total Page Views",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Unique Visitors",
    value: "3,421",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Blog Engagement",
    value: "67%",
    change: "-2.1%",
    trend: "down",
    icon: MessageSquare,
  },
  {
    title: "Event Registrations",
    value: "156",
    change: "+23.4%",
    trend: "up",
    icon: Calendar,
  },
]

const topPages = [
  { page: "/", views: 3247, title: "Homepage" },
  { page: "/about", views: 1892, title: "About Us" },
  { page: "/blog/community-outreach", views: 1456, title: "Community Outreach Program" },
  { page: "/events", views: 1234, title: "Events" },
  { page: "/blog/education-initiative", views: 987, title: "Education Initiative" },
]

const recentActivity = [
  { action: "New blog comment", page: "Community Outreach Program", time: "2 minutes ago" },
  { action: "Event registration", page: "Annual Fundraising Gala", time: "15 minutes ago" },
  { action: "Contact form submission", page: "Contact Us", time: "1 hour ago" },
  { action: "Newsletter signup", page: "Homepage", time: "2 hours ago" },
  { action: "Blog post view", page: "Education Initiative", time: "3 hours ago" },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Analytics" breadcrumbs={[{ label: "Analytics" }]} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center text-xs">
                {item.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={item.trend === "up" ? "text-green-600" : "text-red-600"}>{item.change}</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{page.title}</p>
                      <p className="text-xs text-muted-foreground">{page.page}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{page.views.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.page}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
