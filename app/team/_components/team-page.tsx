"use client";

import { toast } from "sonner";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { deleteTeamMemberAction, emailTeamMemberAction } from "@/lib/actions";
import { useCurrentUser } from "@/lib/hooks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { capitalize } from "@/lib/utils";
import TeamMemberCard from "./team-member-card";
import TeamEmptyState from "./team-empty-state";

interface TeamPageProps {
  members: TeamMember[];
}

export default function TeamPageClient({ members }: TeamPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const currentUser = useCurrentUser();

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
      deleteTeamMemberAction(member.id, currentUser?.id).then((res) => {
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

      {filteredMembers.length === 0 ? (
        <TeamEmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={() => router.push(`/team/${member.id}/edit`)}
              onEmail={() => openEmailModal(member)}
              onDelete={() => handleDelete(member)}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

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
