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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Extended mock data for pagination testing
const allEvents = [
  {
    id: 1,
    title: "Annual Fundraising Gala 2024",
    date: "2024-03-15",
    time: "18:00",
    location: "Grand Ballroom, City Hotel",
    status: "upcoming",
    attendees: 150,
    maxAttendees: 200,
    description: "Join us for an evening of celebration and fundraising...",
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
    description: "Educational workshop on community health and wellness...",
  },
  {
    id: 3,
    title: "Volunteer Training Session",
    date: "2024-01-10",
    time: "10:00",
    location: "Foundation Office",
    status: "completed",
    attendees: 25,
    maxAttendees: 30,
    description: "Training session for new volunteers...",
  },
  {
    id: 4,
    title: "Youth Mentorship Program Launch",
    date: "2024-04-05",
    time: "16:00",
    location: "Local High School",
    status: "draft",
    attendees: 0,
    maxAttendees: 100,
    description: "Launch event for our new youth mentorship program...",
  },
  {
    id: 5,
    title: "Monthly Board Meeting",
    date: "2024-02-01",
    time: "09:00",
    location: "Foundation Office",
    status: "completed",
    attendees: 12,
    maxAttendees: 15,
    description: "Monthly board meeting to discuss foundation matters...",
  },
  {
    id: 6,
    title: "Community Clean-up Day",
    date: "2024-03-22",
    time: "08:00",
    location: "Central Park",
    status: "upcoming",
    attendees: 78,
    maxAttendees: 100,
    description: "Community-wide clean-up initiative...",
  },
  {
    id: 7,
    title: "Educational Seminar",
    date: "2024-04-12",
    time: "13:00",
    location: "University Auditorium",
    status: "draft",
    attendees: 0,
    maxAttendees: 250,
    description: "Educational seminar on sustainable development...",
  },
  {
    id: 8,
    title: "Holiday Charity Drive",
    date: "2023-12-15",
    time: "10:00",
    location: "Multiple Locations",
    status: "completed",
    attendees: 200,
    maxAttendees: 200,
    description: "Annual holiday charity drive for local families...",
  },
  {
    id: 9,
    title: "Summer Youth Camp",
    date: "2024-07-15",
    time: "09:00",
    location: "Camp Sunshine",
    status: "upcoming",
    attendees: 45,
    maxAttendees: 80,
    description: "Week-long summer camp for underprivileged youth...",
  },
  {
    id: 10,
    title: "Mental Health Awareness Workshop",
    date: "2024-05-10",
    time: "14:00",
    location: "Community Center",
    status: "draft",
    attendees: 0,
    maxAttendees: 50,
    description: "Workshop focusing on mental health awareness and support...",
  },
  {
    id: 11,
    title: "Senior Citizens Support Meeting",
    date: "2024-03-05",
    time: "10:00",
    location: "Senior Center",
    status: "upcoming",
    attendees: 30,
    maxAttendees: 40,
    description: "Monthly support meeting for senior citizens...",
  },
  {
    id: 12,
    title: "Environmental Conservation Talk",
    date: "2024-04-22",
    time: "15:00",
    location: "Nature Center",
    status: "upcoming",
    attendees: 25,
    maxAttendees: 60,
    description: "Educational talk on environmental conservation efforts...",
  },
];

const ITEMS_PER_PAGE = 5;

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  // Filter and search logic
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleSelectEvent = (eventId: number) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    const currentEventIds = currentEvents.map((event) => event.id);
    const allCurrentSelected = currentEventIds.every((id) =>
      selectedEvents.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedEvents((prev) =>
        prev.filter((id) => !currentEventIds.includes(id))
      );
    } else {
      setSelectedEvents((prev) => [...new Set([...prev, ...currentEventIds])]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedEvents.length} event(s)?`
      )
    ) {
      console.log("Bulk deleting events:", selectedEvents);
      console.log(selectedEvents);
      setSelectedEvents([]);
    }
  };

  const handleViewEvent = (event: any) => {
    console.log("Viewing event details:", event);
  };

  const handleEditEvent = (event: any) => {
    router.push(`/events/${event.id}/edit`);
  };

  const handleManageAttendees = (event: any) => {
    console.log("Managing attendees for event:", event);
  };

  const handleDeleteEvent = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      console.log("Deleting event:", eventId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const allCurrentSelected =
    currentEvents.length > 0 &&
    currentEvents.every((event) => selectedEvents.includes(event.id));
  const someCurrentSelected = currentEvents.some((event) =>
    selectedEvents.includes(event.id)
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Events" breadcrumbs={[{ label: "Events" }]} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
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
                  ? "All Status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>
                Upcoming
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {selectedEvents.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedEvents.length})
            </Button>
          )}
          <Button onClick={() => router.push("/events/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Manage your events, track attendance, and update event details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allCurrentSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someCurrentSelected && !allCurrentSelected;
                    }}
                  />
                </TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date & Time
                </TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Attendees
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => handleSelectEvent(event.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {event.description}
                      </div>
                      <div className="flex items-center gap-4 mt-2 md:hidden">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {event.date} at {event.time}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 lg:hidden">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {event.attendees}/{event.maxAttendees}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem
                          onClick={() => handleViewEvent(event)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditEvent(event)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleManageAttendees(event)}
                          className="cursor-pointer"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Manage Attendees
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(event.id)}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingStart={startIndex + 1}
            showingEnd={Math.min(endIndex, filteredEvents.length)}
            totalItems={filteredEvents.length}
            itemName="events"
          />
        </CardContent>
      </Card>
    </div>
  );
}
