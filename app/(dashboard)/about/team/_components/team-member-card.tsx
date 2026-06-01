"use client";

import {
  Edit,
  Trash2,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MoreHorizontal,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { teamSocialFields } from "@/lib/team-social-fields";

type Props = {
  member: TeamMember;
  onEdit: () => void;
  onEmail: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  dragHandle?: ReactNode;
};

export default function TeamMemberCard({
  member,
  onEdit,
  onEmail,
  onDelete,
  getStatusColor,
  dragHandle,
}: Props) {
  const visibleSocials = teamSocialFields.filter((field) =>
    Boolean(member[field.name])
  );

  return (
    <Card className="overflow-hidden border-border/70">
      <div className="flex items-stretch gap-3 p-3">
        {dragHandle ? <div className="shrink-0 self-center">{dragHandle}</div> : null}

        <Avatar className="h-12 w-12 shrink-0 rounded-xl">
          <AvatarImage
            src={member.avatar || "/placeholder-user.jpg"}
            alt={member.name}
          />
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{member.name}</CardTitle>
              <CardDescription className="truncate text-xs">
                {member.role}
              </CardDescription>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge className={getStatusColor(member.status)}>
                {member.status}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
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
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <a href={`mailto:${member.email}`} className="inline-flex max-w-[16rem] items-center gap-1 truncate hover:text-primary">
              <MailIcon className="h-3.5 w-3.5" />
              <span className="truncate">{member.email}</span>
            </a>
            {member.phone ? (
              <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                <PhoneIcon className="h-3.5 w-3.5" />
                {member.phone}
              </a>
            ) : null}
            <span>Joined {new Date(member.joinDate).toISOString().slice(0, 10)}</span>
          </div>

          {member.bio ? (
            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
              {member.bio}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {visibleSocials.slice(0, 4).map((field) => (
              <Badge key={field.name} variant="outline" className="text-[0.65rem]">
                {field.label}
              </Badge>
            ))}
            {member.github ? (
              <Badge variant="outline" className="text-[0.65rem]">GitHub</Badge>
            ) : null}
            {visibleSocials.length > 4 ? (
              <Badge variant="secondary" className="text-[0.65rem]">
                +{visibleSocials.length - 4}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
