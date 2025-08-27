"use client";

import {
  Edit,
  Trash2,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddedByCard } from "./added-by";

type Props = {
  member: TeamMember;
  onEdit: () => void;
  onEmail: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
};

export default function TeamMemberCard({
  member,
  onEdit,
  onEmail,
  onDelete,
  getStatusColor,
}: Props) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
              />
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
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEmail} className="cursor-pointer">
                <MailIcon className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(member.status)}>
            {member.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Joined {new Date(member.joinDate).toISOString().slice(0, 10)}
          </span>
        </div>

        {member.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {member.bio}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <MailIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <a
              href={`mailto:${member.email}`}
              className="text-blue-600 hover:underline"
            >
              {member.email}
            </a>
          </div>
          {member.phone && (
            <div className="flex items-center text-sm">
              <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <a
                href={`tel:${member.phone}`}
                className="text-blue-600 hover:underline"
              >
                {member.phone}
              </a>
            </div>
          )}
        </div>
        <AddedByCard admin={member.addedByUser} />
      </CardContent>
    </Card>
  );
}
