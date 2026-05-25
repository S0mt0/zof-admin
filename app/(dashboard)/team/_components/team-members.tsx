"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmailModal from "@/components/common/email-modal";
import TeamMemberCard from "./team-member-card";
import TeamEmptyState from "./team-empty-state";
import { TeamMemberFormDialog } from "./team-member-form-dialog";

import { useReadTeam } from "@/lib/hooks";
import { AlertDialog } from "@/components/common/alert-dialog";

export function TeamMembers({ members }: { members: TeamMember[] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [formTarget, setFormTarget] = useState<TeamMember | null>(null);
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
    target,
    getStatusColor,
    handleDelete,
    openEmailModal,
    sendEmail,
    setSearchTerm,
    setEmailMessage,
    setEmailSubject,
    setEmailOpen,
    toggleDialog,
    setTarget,
  } = useReadTeam(members);

  const openCreateForm = () => {
    setFormTarget(null);
    setFormOpen(true);
  };

  const openEditForm = (member: TeamMember) => {
    setFormTarget(member);
    setFormOpen(true);
  };

  const onSaved = () => {
    setFormOpen(false);
    setFormTarget(null);
    router.refresh();
  };

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
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {filteredMembers.length === 0 ? (
        <TeamEmptyState onAdd={openCreateForm} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={() => openEditForm(member)}
              onEmail={() => openEmailModal(member)}
              onDelete={() => {
                setTarget(member);
                toggleDialog();
              }}
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

      {formOpen ? (
        <TeamMemberFormDialog
          key={formTarget?.id || "create"}
          open={formOpen}
          mode={formTarget ? "edit" : "create"}
          initialData={formTarget}
          onOpenChange={setFormOpen}
          onSaved={onSaved}
        />
      ) : null}

      <AlertDialog
        isOpen={openDialog}
        onCancel={toggleDialog}
        onOk={() => handleDelete(target?.id!)}
        message={`Are you sure you want to remove ${target?.name} from the team?`}
        isPending={isPending}
      />
    </div>
  );
}
