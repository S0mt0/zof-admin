"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, ArrowLeft, Upload, ChevronDown, User, Mail, Phone, Calendar, MapPin, Trash2 } from "lucide-react"

// Mock data
const mockTeamMembers = [
  {
    id: 1,
    name: "Zita Onyeka",
    role: "Founder & Executive Director",
    email: "zita@zitaonyeka.org",
    phone: "+1 (555) 123-4567",
    status: "active",
    joinDate: "2020-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Passionate advocate for community development and social change with over 15 years of experience in nonprofit leadership.",
    department: "Executive",
    location: "New York, NY",
    skills: ["Leadership", "Strategic Planning", "Community Development", "Public Speaking"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/zitaonyeka",
      twitter: "https://twitter.com/zitaonyeka",
      github: "",
    },
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
    bio: "Experienced in program management and community outreach with a focus on education initiatives.",
    department: "Programs",
    location: "Brooklyn, NY",
    skills: ["Program Management", "Community Outreach", "Education", "Event Planning"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "",
      github: "",
    },
  },
]

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = Number.parseInt(params.id as string)

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    bio: "",
    status: "active",
    avatar: "",
    joinDate: "",
    department: "",
    location: "",
    skills: [] as string[],
    newSkill: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load team member data
    const member = mockTeamMembers.find((m) => m.id === memberId)
    if (member) {
      setFormData({
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
        bio: member.bio,
        status: member.status,
        avatar: member.avatar,
        joinDate: member.joinDate,
        department: member.department,
        location: member.location,
        skills: member.skills,
        newSkill: "",
        socialLinks: member.socialLinks,
      })
    }
  }, [memberId])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAddSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }))
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleAvatarUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setFormData((prev) => ({
          ...prev,
          avatar: "/placeholder.svg?height=100&width=100",
        }))
      }
    }
    input.click()
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter team member name")
      return
    }

    if (!formData.email.trim()) {
      alert("Please enter email address")
      return
    }

    setIsLoading(true)
    try {
      const memberData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      }

      console.log("Updating team member:", memberData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Team member updated successfully!")
      router.push("/team")
    } catch (error) {
      console.error("Error updating team member:", error)
      alert("Error updating team member. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to remove this team member? This action cannot be undone.")) {
      setIsLoading(true)
      try {
        console.log("Removing team member:", memberId)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert("Team member removed successfully!")
        router.push("/team")
      } catch (error) {
        console.error("Error removing team member:", error)
        alert("Error removing team member. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Edit Team Member"
        breadcrumbs={[{ label: "Team Members", href: "/team" }, { label: formData.name || "Edit Member" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role/Position</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Program Coordinator"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@zitaonyeka.org"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    placeholder="e.g., Programs, Communications"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, Remote"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange("joinDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description about the team member..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Add relevant skills and areas of expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add skill..."
                  value={formData.newSkill}
                  onChange={(e) => handleInputChange("newSkill", e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button onClick={handleAddSkill} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} ×
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Optional social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange("socialLinks.linkedin", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/username"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleInputChange("socialLinks.twitter", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/username"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleInputChange("socialLinks.github", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={isLoading || !formData.name.trim() || !formData.email.trim()}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Updating..." : "Update Member"}
              </Button>

              <Button onClick={handleDelete} disabled={isLoading} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Member
              </Button>

              <Button onClick={() => router.push("/team")} variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Button>
            </CardContent>
          </Card>

          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                <AvatarFallback className="text-lg">
                  {formData.name ? getInitials(formData.name) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <Button onClick={handleAvatarUpload} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="capitalize">{formData.status}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleInputChange("status", "active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("status", "inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Preview */}
          {formData.name && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{formData.name}</span>
                </div>
                {formData.role && (
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">{formData.role}</span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-green-500" />
                    <span className="truncate">{formData.email}</span>
                  </div>
                )}
                {formData.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-purple-500" />
                    <span>{formData.phone}</span>
                  </div>
                )}
                {formData.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span>{formData.location}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Joined {formData.joinDate}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
