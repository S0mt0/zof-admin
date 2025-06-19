"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Reply, Archive, Trash2, Mail, Clock } from "lucide-react"

// Mock data
const messages = [
  {
    id: 1,
    sender: "John Smith",
    email: "john.smith@email.com",
    subject: "Volunteer Opportunity Inquiry",
    preview: "Hi, I'm interested in volunteering for your upcoming community outreach program...",
    time: "2 hours ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    sender: "Maria Garcia",
    email: "maria.garcia@email.com",
    subject: "Donation Receipt Request",
    preview: "Could you please send me a receipt for my recent donation of $500...",
    time: "5 hours ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    sender: "David Johnson",
    email: "david.johnson@email.com",
    subject: "Event Partnership Proposal",
    preview: "Our organization would like to partner with you for the upcoming fundraising gala...",
    time: "1 day ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    sender: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    subject: "Thank You for the Workshop",
    preview: "I wanted to thank you for the amazing health workshop last week...",
    time: "2 days ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    sender: "Michael Brown",
    email: "michael.brown@email.com",
    subject: "Media Interview Request",
    preview: "I'm a journalist with Local News and would love to interview Zita about...",
    time: "3 days ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMessages = messages.filter(
    (message) =>
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = messages.filter((m) => m.status === "unread").length

  const handleReplyMessage = (message: any) => {
    console.log("Replying to message:", message)
    // Open reply interface or navigate to compose
  }

  const handleToggleReadStatus = (messageId: number, currentStatus: string) => {
    console.log("Toggling read status for message:", messageId)
    // Update message status in state or backend
  }

  const handleArchiveMessage = (messageId: number) => {
    console.log("Archiving message:", messageId)
    // Move message to archive
  }

  const handleDeleteMessage = (messageId: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      console.log("Deleting message:", messageId)
      // Add actual delete logic here
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Messages" breadcrumbs={[{ label: "Messages" }]} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {unreadCount > 0 && <Badge className="bg-pink-100 text-pink-800 border-pink-200">{unreadCount} unread</Badge>}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Manage your messages and communications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:bg-gray-50 cursor-pointer ${
                  message.status === "unread" ? "bg-pink-50 border-pink-200" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                      <AvatarFallback>
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${message.status === "unread" ? "font-semibold" : ""}`}>
                          {message.sender}
                        </h3>
                        {message.status === "unread" && <div className="h-2 w-2 bg-pink-500 rounded-full"></div>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                      <p className={`text-sm mb-2 ${message.status === "unread" ? "font-medium" : ""}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.preview}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {message.time}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleReadStatus(message.id, message.status)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Mark as {message.status === "unread" ? "Read" : "Unread"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveMessage(message.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMessage(message.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
