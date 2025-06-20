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
import { Save, ArrowLeft, Upload, ChevronDown, Calendar, MapPin, Users, Trash2 } from "lucide-react"

// Mock data - in real app, this would come from API
const mockEvents = [
  {
    id: 1,
    title: "Annual Fundraising Gala 2024",
    date: "2024-03-15",
    time: "18:00",
    location: "Grand Ballroom, City Hotel",
    status: "upcoming",
    attendees: 150,
    maxAttendees: 200,
    description:
      "Join us for an evening of celebration and fundraising to support our community initiatives. This gala will feature dinner, entertainment, and inspiring stories from our beneficiaries.",
    bannerImage: "/placeholder.svg?height=300&width=600",
    category: "Fundraising",
    organizer: "Admin User",
    registrationDeadline: "2024-03-10",
    ticketPrice: "150.00",
    requirements: "Formal attire required",
  },
  {
    id: 2,
    title: "Community Health Workshop",
    date: "2024-02-20",
    time: "14:00",
    location: "Community Center",
    status: "upcoming",
    attendees: 45,
    maxAttendees: 60,
    description: "Educational workshop on community health and wellness practices.",
    bannerImage: "/placeholder.svg?height=300&width=600",
    category: "Education",
    organizer: "Dr. Emily Rodriguez",
    registrationDeadline: "2024-02-15",
    ticketPrice: "0.00",
    requirements: "None",
  },
]

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = Number.parseInt(params.id as string)

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    maxAttendees: "",
    status: "draft",
    category: "",
    organizer: "",
    registrationDeadline: "",
    ticketPrice: "",
    requirements: "",
    bannerImage: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    // Load event data
    const event = mockEvents.find((e) => e.id === eventId)
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        maxAttendees: event.maxAttendees.toString(),
        status: event.status,
        category: event.category,
        organizer: event.organizer,
        registrationDeadline: event.registrationDeadline,
        ticketPrice: event.ticketPrice,
        requirements: event.requirements,
        bannerImage: event.bannerImage,
      })
      setCharacterCount(event.description.length)
    }
  }, [eventId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "description") {
      setCharacterCount(value.length)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert("Please enter an event title")
      return
    }

    if (!formData.date) {
      alert("Please select an event date")
      return
    }

    if (formData.status === "published" && characterCount < 50) {
      alert("Event description must be at least 50 characters for published events")
      return
    }

    setIsLoading(true)
    try {
      const eventData = {
        ...formData,
        maxAttendees: Number.parseInt(formData.maxAttendees) || 0,
        ticketPrice: Number.parseFloat(formData.ticketPrice) || 0,
        updatedAt: new Date().toISOString(),
      }

      console.log("Updating event:", eventData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Event updated successfully!")
      router.push("/events")
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Error updating event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      setIsLoading(true)
      try {
        console.log("Deleting event:", eventId)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert("Event deleted successfully!")
        router.push("/events")
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Error deleting event. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBannerUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setFormData((prev) => ({
          ...prev,
          bannerImage: "/placeholder.svg?height=300&width=600",
        }))
      }
    }
    input.click()
  }

  const getCharacterCountColor = () => {
    if (characterCount > 300) return "text-red-600"
    if (characterCount > 250) return "text-orange-600"
    return "text-gray-600"
  }

  const getCharacterCountBg = () => {
    if (characterCount > 300) return "bg-red-50 border-red-200"
    if (characterCount > 250) return "bg-orange-50 border-orange-200"
    return ""
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Edit Event"
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: formData.title || "Edit Event" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Update the basic information about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Event Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location..."
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Fundraising, Education"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    placeholder="Event organizer name"
                    value={formData.organizer}
                    onChange={(e) => handleInputChange("organizer", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="100"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.ticketPrice}
                    onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Event Description</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Describe your event in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    maxLength={300}
                    className={`resize-none ${getCharacterCountBg()}`}
                  />
                  <div className={`absolute bottom-2 right-2 text-xs ${getCharacterCountColor()}`}>
                    {characterCount}/300
                  </div>
                </div>
                {formData.status === "published" && characterCount < 50 && (
                  <p className="text-sm text-red-600 mt-1">
                    Description must be at least 50 characters for published events
                  </p>
                )}
                {characterCount > 300 && (
                  <p className="text-sm text-red-600 mt-1">Description exceeds maximum length</p>
                )}
              </div>

              <div>
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any special requirements or notes..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  rows={3}
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
                disabled={isLoading || !formData.title.trim() || characterCount > 300}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Updating..." : "Update Event"}
              </Button>

              <Button onClick={handleDelete} disabled={isLoading} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </Button>

              <Button onClick={() => router.push("/events")} variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Event Status</CardTitle>
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
                  <DropdownMenuItem onClick={() => handleInputChange("status", "draft")}>Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("status", "upcoming")}>Upcoming</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("status", "completed")}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("status", "cancelled")}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Banner Image */}
          <Card>
            <CardHeader>
              <CardTitle>Event Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.bannerImage && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.bannerImage || "/placeholder.svg"}
                    alt="Event banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Button onClick={handleBannerUpload} variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {formData.bannerImage ? "Change Banner" : "Upload Banner"}
              </Button>
            </CardContent>
          </Card>

          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>
                  {formData.date} at {formData.time}
                </span>
              </div>
              {formData.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span>{formData.location}</span>
                </div>
              )}
              {formData.maxAttendees && (
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  <span>Max {formData.maxAttendees} attendees</span>
                </div>
              )}
              {formData.ticketPrice && Number.parseFloat(formData.ticketPrice) > 0 && (
                <div className="flex items-center text-sm">
                  <span className="font-medium">Price: ${formData.ticketPrice}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
