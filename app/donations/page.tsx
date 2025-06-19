"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Download, Mail, Heart, DollarSign, TrendingUp, Users } from "lucide-react"

// Mock data
const donations = [
  {
    id: 1,
    donor: "Anonymous",
    email: "anonymous@donor.com",
    amount: 1000,
    date: "2024-01-15",
    method: "Credit Card",
    status: "completed",
    campaign: "General Fund",
    recurring: false,
  },
  {
    id: 2,
    donor: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    amount: 250,
    date: "2024-01-14",
    method: "PayPal",
    status: "completed",
    campaign: "Education Initiative",
    recurring: true,
  },
  {
    id: 3,
    donor: "Michael Chen",
    email: "michael.chen@email.com",
    amount: 500,
    date: "2024-01-12",
    method: "Bank Transfer",
    status: "pending",
    campaign: "Community Outreach",
    recurring: false,
  },
  {
    id: 4,
    donor: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    amount: 100,
    date: "2024-01-10",
    method: "Credit Card",
    status: "completed",
    campaign: "Health Workshop",
    recurring: true,
  },
]

const stats = [
  {
    title: "Total Donations",
    value: "$12,847",
    description: "+15% from last month",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Monthly Goal",
    value: "68%",
    description: "$8,500 of $12,500",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Donors",
    value: "156",
    description: "12 new this month",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Recurring",
    value: "42",
    description: "Monthly supporters",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
]

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDownloadReceipt = (donation: any) => {
    console.log("Downloading receipt for donation:", donation)
    // Generate and download receipt PDF
    alert(`Receipt for donation #${donation.id} will be downloaded`)
  }

  const handleSendThankYou = (donation: any) => {
    console.log("Sending thank you email for donation:", donation)
    // Send thank you email
    alert(`Thank you email sent to ${donation.donor}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Donations" breadcrumbs={[{ label: "Donations" }]} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div
                className={`h-8 w-8 rounded-lg ${stat.color.replace("text-", "bg-").replace("600", "100")} flex items-center justify-center`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Track and manage all donations to your foundation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Campaign</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {donation.donor}
                        {donation.recurring && <Heart className="h-3 w-3 text-rose-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">{donation.email}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{donation.campaign}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${donation.amount}</div>
                    <div className="text-sm text-muted-foreground">{donation.method}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{donation.campaign}</TableCell>
                  <TableCell className="hidden sm:table-cell">{donation.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleDownloadReceipt(donation)} className="cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendThankYou(donation)} className="cursor-pointer">
                          <Mail className="mr-2 h-4 w-4" />
                          Thank You Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
