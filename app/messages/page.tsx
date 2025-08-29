"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Search,
  MoreHorizontal,
  Reply,
  Archive,
  Trash2,
  Mail,
  Clock,
  Filter,
} from "lucide-react";

// Extended mock data for pagination testing
const allMessages = [
  {
    id: 1,
    sender: "John Smith",
    email: "john.smith@email.com",
    subject: "Volunteer Opportunity Inquiry",
    preview:
      "Hi, I'm interested in volunteering for your upcoming community outreach program...",
    time: "2 hours ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    sender: "Maria Garcia",
    email: "maria.garcia@email.com",
    subject: "Donation Receipt Request",
    preview:
      "Could you please send me a receipt for my recent donation of $500...",
    time: "5 hours ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    sender: "David Johnson",
    email: "david.johnson@email.com",
    subject: "Event Partnership Proposal",
    preview:
      "Our organization would like to partner with you for the upcoming fundraising gala...",
    time: "1 day ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    sender: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    subject: "Thank You for the Workshop",
    preview:
      "I wanted to thank you for the amazing health workshop last week...",
    time: "2 days ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    sender: "Michael Brown",
    email: "michael.brown@email.com",
    subject: "Media Interview Request",
    preview:
      "I'm a journalist with Local News and would love to interview Zita about...",
    time: "3 days ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    sender: "Lisa Chen",
    email: "lisa.chen@email.com",
    subject: "Sponsorship Opportunity",
    preview:
      "Our company is interested in sponsoring your next community event...",
    time: "4 days ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    sender: "Robert Taylor",
    email: "robert.taylor@email.com",
    subject: "Volunteer Training Question",
    preview:
      "I have some questions about the upcoming volunteer training session...",
    time: "5 days ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    sender: "Amanda Rodriguez",
    email: "amanda.rodriguez@email.com",
    subject: "Program Feedback",
    preview:
      "I wanted to share some feedback about the youth mentorship program...",
    time: "1 week ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    sender: "James Wilson",
    email: "james.wilson@email.com",
    subject: "Collaboration Request",
    preview:
      "We're reaching out to explore potential collaboration opportunities...",
    time: "1 week ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    sender: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    subject: "Event Attendance Confirmation",
    preview:
      "I'm writing to confirm my attendance at the upcoming fundraising gala...",
    time: "1 week ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 11,
    sender: "Thomas Anderson",
    email: "thomas.anderson@email.com",
    subject: "Grant Application Support",
    preview:
      "We would like to offer our support for your upcoming grant application...",
    time: "2 weeks ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 12,
    sender: "Patricia Moore",
    email: "patricia.moore@email.com",
    subject: "Community Survey Response",
    preview:
      "Thank you for conducting the community needs survey. Here are my thoughts...",
    time: "2 weeks ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 13,
    sender: "Christopher Davis",
    email: "christopher.davis@email.com",
    subject: "Volunteer Appreciation",
    preview:
      "I wanted to express my gratitude for the volunteer appreciation event...",
    time: "3 weeks ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 14,
    sender: "Michelle Thompson",
    email: "michelle.thompson@email.com",
    subject: "Educational Workshop Inquiry",
    preview:
      "I'm interested in attending your upcoming educational workshop series...",
    time: "3 weeks ago",
    status: "unread",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 15,
    sender: "Daniel Martinez",
    email: "daniel.martinez@email.com",
    subject: "Partnership Proposal",
    preview:
      "Our local business would like to explore partnership opportunities...",
    time: "1 month ago",
    status: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const ITEMS_PER_PAGE = 6;

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredMessages = allMessages.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  const unreadCount = allMessages.filter((m) => m.status === "unread").length;

  const handleSelectMessage = (messageId: number) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    const currentMessageIds = currentMessages.map((message) => message.id);
    const allCurrentSelected = currentMessageIds.every((id) =>
      selectedMessages.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedMessages((prev) =>
        prev.filter((id) => !currentMessageIds.includes(id))
      );
    } else {
      setSelectedMessages((prev) => [
        ...new Set([...prev, ...currentMessageIds]),
      ]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedMessages.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedMessages.length} message(s)?`
      )
    ) {
      console.log("Bulk deleting messages:", selectedMessages);
      setSelectedMessages([]);
    }
  };

  const handleReplyMessage = (message: any) => {
    console.log("Replying to message:", message);
  };

  const handleToggleReadStatus = (messageId: number, currentStatus: string) => {
    console.log("Toggling read status for message:", messageId);
  };

  const handleArchiveMessage = (messageId: number) => {
    console.log("Archiving message:", messageId);
  };

  const handleDeleteMessage = (messageId: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      console.log("Deleting message:", messageId);
    }
  };

  const allCurrentSelected =
    currentMessages.length > 0 &&
    currentMessages.every((message) => selectedMessages.includes(message.id));
  const someCurrentSelected = currentMessages.some((message) =>
    selectedMessages.includes(message.id)
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Messages" }]} />

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all"
                  ? "All Messages"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("unread")}>
                Unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("read")}>
                Read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {unreadCount > 0 && (
            <Badge className="bg-pink-100 text-pink-800 border-pink-200">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedMessages.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedMessages.length})
            </Button>
          )}
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>
                Manage your messages and communications.
              </CardDescription>
            </div>
            <Checkbox
              checked={allCurrentSelected}
              onCheckedChange={handleSelectAll}
              ref={(el) => {
                if (el)
                  el.indeterminate = someCurrentSelected && !allCurrentSelected;
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:bg-gray-50 cursor-pointer ${
                  message.status === "unread"
                    ? "bg-pink-50 border-pink-200"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={selectedMessages.includes(message.id)}
                      onCheckedChange={() => handleSelectMessage(message.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.sender}
                      />
                      <AvatarFallback>
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-medium ${
                            message.status === "unread" ? "font-semibold" : ""
                          }`}
                        >
                          {message.sender}
                        </h3>
                        {message.status === "unread" && (
                          <div className="h-2 w-2 bg-pink-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {message.email}
                      </p>
                      <p
                        className={`text-sm mb-2 ${
                          message.status === "unread" ? "font-medium" : ""
                        }`}
                      >
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {message.time}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => handleReplyMessage(message)}
                          className="cursor-pointer"
                        >
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleReadStatus(message.id, message.status)
                          }
                          className="cursor-pointer"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Mark as{" "}
                          {message.status === "unread" ? "Read" : "Unread"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchiveMessage(message.id)}
                          className="cursor-pointer"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMessage(message.id)}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingStart={startIndex + 1}
            showingEnd={Math.min(endIndex, filteredMessages.length)}
            totalItems={filteredMessages.length}
            itemName="messages"
          />
        </CardContent>
      </Card>
    </div>
  );
}
