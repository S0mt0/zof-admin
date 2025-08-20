"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import EmailModal from "./email-modal";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { deleteTeamMemberAction, emailTeamMemberAction } from "@/lib/actions";

interface TeamPageProps {
  members: TeamMember[];
}

export default function TeamPageClient({ members }: TeamPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchTerm.toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q)
      );
    });
  }, [members, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDelete = (member: TeamMember) => {
    if (!confirm(`Remove ${member.name}?`)) return;
    startTransition(() => {
      deleteTeamMemberAction(member.id).then((res) => {
        if (res?.error) toast.error(res.error);
        if (res?.success) toast.success(res.success);
      });
    });
  };

  const openEmailModal = (member: TeamMember) => {
    setEmailTo(member.email);
    setEmailSubject("");
    setEmailMessage("");
    setEmailOpen(true);
  };

  const sendEmail = () => {
    if (!emailTo || !emailSubject || !emailMessage) {
      toast.error("All fields are required");
      return;
    }
    startTransition(() => {
      emailTeamMemberAction(emailTo, emailSubject, emailMessage).then((res) => {
        if (res?.error) toast.error(res.error);
        if (res?.success) {
          toast.success(res.success);
          setEmailOpen(false);
        }
      });
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Team Members"
        breadcrumbs={[{ label: "Team Members" }]}
      />

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
                      onClick={() => router.push(`/team/${member.id}/edit`)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openEmailModal(member)}
                      className="cursor-pointer"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(member)}
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
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
                {member.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={`tel:${member.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EmailModal
        open={emailOpen}
        to={emailTo}
        subject={emailSubject}
        message={emailMessage}
        onSubjectChange={setEmailSubject}
        onMessageChange={setEmailMessage}
        onClose={() => setEmailOpen(false)}
        onSend={sendEmail}
        disabled={isPending}
        pending={isPending}
      />
    </div>
  );
}
