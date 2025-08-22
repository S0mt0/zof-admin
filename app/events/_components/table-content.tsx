import { format } from "date-fns";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const TableContent = ({
  events,
  selectedEvents,
  onSelectEvent,
  onViewEvent,
  onEditEvent,
  onManageAttendees,
  onDeleteEvent,
}: EventTableContentProps) => {
  const getStatusColor = (status: IEvent["status"]) => {
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

  return (
    <TableBody>
      {events.map((event) => (
        <TableRow key={event.id}>
          <TableCell>
            <Checkbox
              checked={selectedEvents.includes(event.id)}
              onCheckedChange={() => onSelectEvent(event.id)}
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
                  {format(event.date, "yyyy-MM-dd")} at {event.startTime}
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
                <div className="font-medium">
                  {format(event.date, "yyyy-MM-dd")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.startTime}
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
            {event.featured ? (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 border-yellow-200"
              >
                ⭐ Featured
              </Badge>
            ) : (
              <span className="text-muted-foreground">Not Featured</span>
            )}
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
                  onClick={() => onViewEvent(event)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEditEvent(event)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onManageAttendees(event)}
                  className="cursor-pointer"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Attendees
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteEvent(event.id)}
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
  );
};
