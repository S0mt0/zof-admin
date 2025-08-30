import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { deleteTeamMemberAction, emailTeamMemberAction } from "../actions/team";

export const useReadTeam = (members: TeamMember[]) => {
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

  return {
    router,
    isPending,
    emailOpen,
    emailTo,
    emailSubject,
    emailMessage,
    filteredMembers,
    searchTerm,
    setSearchTerm,
    getStatusColor,
    handleDelete,
    openEmailModal,
    sendEmail,
    setEmailSubject,
    setEmailMessage,
    setEmailOpen,
  };
};
