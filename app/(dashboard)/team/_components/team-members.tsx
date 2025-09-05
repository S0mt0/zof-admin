"use client";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmailModal from "@/components/email-modal";
import TeamMemberCard from "./team-member-card";
import TeamEmptyState from "./team-empty-state";

import { useReadTeam } from "@/lib/hooks";
import { AlertDialog } from "@/components/alert-dialog";

export function TeamMembers({ members }: { members: TeamMember[] }) {
  const {
    emailMessage,
    emailOpen,
    emailSubject,
    emailTo,
    filteredMembers,
    isPending,
    router,
    searchTerm,
    openDialog,
    getStatusColor,
    handleDelete,
    openEmailModal,
    sendEmail,
    setSearchTerm,
    setEmailMessage,
    setEmailSubject,
    setEmailOpen,
    toggleDialog,
  } = useReadTeam(members);

  return (
    <div className="space-y-4">
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
              openDialog={openDialog}
              toggleDialog={toggleDialog}
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
