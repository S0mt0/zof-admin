"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Save, ArrowLeft, Upload, ChevronDown, Calendar, MapPin, Users, Clock } from "lucide-react"

export default function NewEventPage() {
  const router = useRouter()
  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    maxAttendees: "",
    status: "draft",
    bannerImage: "",
    organizer: "Admin User",
    tags: [] as string[],
    newTag: "",
    ticketPrice: "",
    registrationRequired: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initEditor = async () => {
      if (typeof window !== "undefined" && !editorRef.current) {
        // Load EditorJS and plugins
        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const List = (await import("@editorjs/list")).default
        const Paragraph = (await import("@editorjs/paragraph")).default
        const Image = (await import("@editorjs/image")).default
        const Quote = (await import("@editorjs/quote")).default
        const Delimiter = (await import("@editorjs/delimiter")).default
        const Table = (await import("@editorjs/table")).default

        editorRef.current = new EditorJS({
          holder: "event-editorjs",
          placeholder: "Describe your event in detail...",
          tools: {
            header: {
              class: Header,
              config: {
                levels: [2, 3],
                defaultLevel: 2,
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve({
                          success: 1,
                          file: {
                            url: "/placeholder.svg?height=300&width=600",
                          },
                        })
                      }, 1000)
                    })
                  },
                },
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
            },
            delimiter: Delimiter,
            table: {
              class: Table,
              inlineToolbar: true,
            },
          },
          data: {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: "Provide detailed information about your event, including agenda, speakers, requirements, and what attendees can expect...",
                },
              },
            ],
          },
        })

        setIsEditorReady(true)
      }
    }

    initEditor()

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setFormData((prev) => ({
          ...prev,
          bannerImage: "/placeholder.svg?height=400&width=800",
        }))
      }
    }
    input.click()
  }

  const handleSave = async (status: string) => {
    if (!editorRef.current) return

    setIsLoading(true)
    try {
      const editorData = await editorRef.current.save()

      const event = {
        ...formData,
        status,
        content: editorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attendees: 0,
      }

      console.log("Saving event:", event)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert(`Event ${status === "upcoming" ? "published" : "saved as draft"} successfully!`)
      router.push("/events")
    } catch (error) {
      console.error("Error saving event:", error)
      alert("Error saving event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Create New Event"
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: "New Event" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your event title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your event..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
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
                  <Label htmlFor="time">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Event venue or address..."
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ticketPrice">Ticket Price (optional)</Label>
                <Input
                  id="ticketPrice"
                  placeholder="e.g., $25 or Free"
                  value={formData.ticketPrice}
                  onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Banner Image */}
          <Card>
            <CardHeader>
              <CardTitle>Event Banner</CardTitle>
              <CardDescription>Upload a banner image for your event</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.bannerImage ? (
                <div className="relative">
                  <img
                    src={formData.bannerImage || "/placeholder.svg"}
                    alt="Banner preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button variant="secondary" size="sm" onClick={handleImageUpload} className="absolute top-2 right-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              ) : (
                <div
                  onClick={handleImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload event banner</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Content */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details & Agenda</CardTitle>
              <CardDescription>Provide detailed information about your event</CardDescription>
            </CardHeader>
            <CardContent>
              <div id="event-editorjs" className="min-h-[400px] prose max-w-none" style={{ outline: "none" }} />
              {!isEditorReady && (
                <div className="flex items-center justify-center h-32">
                  <div className="text-sm text-gray-500">Loading editor...</div>
                </div>
              )}
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
                onClick={() => handleSave("draft")}
                disabled={isLoading || !formData.title.trim()}
                className="w-full"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                onClick={() => handleSave("upcoming")}
                disabled={isLoading || !formData.title.trim() || !formData.date}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Publishing..." : "Publish Event"}
              </Button>

              <Button onClick={() => router.push("/events")} variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
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
                <span>{formData.date || "Date not set"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <span>
                  {formData.time || "Time not set"}
                  {formData.endTime && ` - ${formData.endTime}`}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                <span>{formData.location || "Location not set"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                <span>Max {formData.maxAttendees || "∞"} attendees</span>
              </div>
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
                  <DropdownMenuItem onClick={() => handleInputChange("status", "draft")}>Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("status", "upcoming")}>Upcoming</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange("status", "cancelled")}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={formData.newTag}
                  onChange={(e) => handleInputChange("newTag", e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
