"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data
const teamMembers = [
  {
    id: 1,
    name: "Zita Onyeka",
    role: "Founder & Executive Director",
    email: "zita@zitaonyeka.org",
    phone: "+1 (555) 123-4567",
    status: "active",
    joinDate: "2020-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Passionate advocate for community development and social change.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Program Coordinator",
    email: "sarah@zitaonyeka.org",
    phone: "+1 (555) 234-5678",
    status: "active",
    joinDate: "2022-03-20",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Experienced in program management and community outreach.",
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Communications Manager",
    email: "mike@zitaonyeka.org",
    phone: "+1 (555) 345-6789",
    status: "active",
    joinDate: "2021-08-10",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Digital marketing specialist with focus on nonprofit communications.",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Volunteer Coordinator",
    email: "emily@zitaonyeka.org",
    phone: "+1 (555) 456-7890",
    status: "inactive",
    joinDate: "2023-01-05",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Dedicated to building strong volunteer communities.",
  },
  {
    id: 5,
    name: "David Thompson",
    role: "Finance Manager",
    email: "david@zitaonyeka.org",
    phone: "+1 (555) 567-8901",
    status: "active",
    joinDate: "2021-11-15",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "CPA with extensive nonprofit financial management experience.",
  },
]

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleEditMember = (member: any) => {
    console.log("Editing profile for member:", member)
    // Open edit modal or navigate to edit page
  }

  const handleSendEmail = (member: any) => {
    window.location.href = `mailto:${member.email}?subject=Hello from Zita Onyeka Foundation`
  }

  const handleRemoveMember = (member: any) => {
    if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      console.log("Removing team member:", member)
      // Add actual remove logic here
      alert(`${member.name} has been removed from the team`)
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Team Members" breadcrumbs={[{ label: "Team Members" }]} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => router.push("/team/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => handleEditMember(member)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSendEmail(member)} className="cursor-pointer">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRemoveMember(member)}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                <span className="text-sm text-muted-foreground">Joined {member.joinDate}</span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                    {member.email}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                    {member.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
