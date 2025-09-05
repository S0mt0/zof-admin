import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  bulkDeleteMessagesAction,
  deleteMessageAction,
  toggleMessageStatusAction,
  replyMessageAction,
} from "../actions/messages";
import { EDITORIAL_ROLES } from "../constants";
import { useCurrentUser } from "./use-current-user";

export const useMessages = (messages: IMessage[]) => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [actionType, setActionType] = useState<"bulk" | "single" | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const [activeMessage, setActiveMessage] = useState<IMessage | null>();

  const user = useCurrentUser();

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const toggleDialog = () => setOpenDialog((curr) => !curr);

  const handleSelectAll = () => {
    const currentMessageIds = messages.map((message) => message.id);
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

  const handleDelete = (id: string) => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }
    toggleDialog();

    const loading = toast.loading("Deleting...");
    startTransition(() => {
      deleteMessageAction(id)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
          } else if (res?.success) {
            toast.success(res.success);
            setSelectedMessages([]);
          }
        })
        .catch(() => {
          toast.error("Error deleting message");
        })
        .finally(() => {
          toast.dismiss(loading);
        });
    });
  };

  const handleBulkDelete = () => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }
    toggleDialog();

    if (selectedMessages.length === 0) return;
    if (selectedMessages.length === 1) return handleDelete(selectedMessages[0]);

    const loading = toast.loading("Deleting...");
    startTransition(() => {
      bulkDeleteMessagesAction(selectedMessages)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
          } else if (res?.success) {
            toast.success(res.success);
            setSelectedMessages([]);
          }
        })
        .catch(() => {
          toast.error("Failed to delete messages");
        })
        .finally(() => {
          toast.dismiss(loading);
        });
    });
  };

  const openReplyModal = (message: IMessage) => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    setActiveMessage(message);
    setReplyTo(message.email);
    setReplySubject(`Re: ${message.subject}`);
    setReplyMessage("");
    setReplyModalOpen((curr) => !curr);
  };

  const toggleMessageModal = (id?: string) => {
    if (id) {
      const message = messages.find((msg) => msg.id === id);
      setActiveMessage(message);
    } else {
      setActiveMessage(null);
    }
    setMessageOpen((curr) => !curr);
  };

  const sendReply = () => {
    if (!replyTo || !replySubject || !replyMessage) {
      toast.error("All fields are required");
      return;
    }

    const loading = toast.loading("Sending reply...");
    startTransition(() => {
      replyMessageAction(
        replyTo,
        replySubject,
        replyMessage,
        activeMessage?.sender
      )
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
          } else if (res?.success) {
            toast.success(res.success);
            setReplyModalOpen((curr) => !curr);
            setActiveMessage(null);
          }
        })
        .catch(() => {
          toast.error("Error sending reply");
        })
        .finally(() => {
          toast.dismiss(loading);
        });
    });
  };

  const toggleMessageStatus = async (id: string, status: MessageStatus) => {
    startTransition(() => {
      toggleMessageStatusAction(id, status)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
          }
        })
        .catch((e) => {
          toast.error("Something went wrong");
        });
    });
  };

  const allCurrentSelected =
    messages.length > 0 &&
    messages.every((message) => selectedMessages.includes(message.id));

  const someCurrentSelected = messages.some((message) =>
    selectedMessages.includes(message.id)
  );

  return {
    messageOpen,
    isPending,
    replyModalOpen,
    replyTo,
    replySubject,
    replyMessage,
    selectedMessages,
    allCurrentSelected,
    someCurrentSelected,
    activeMessage,
    actionType,
    targetId,
    openDialog,
    handleBulkDelete,
    handleDelete,
    openReplyModal,
    sendReply,
    setReplySubject,
    setReplyMessage,
    setReplyModalOpen,
    toggleMessageModal,
    toggleMessageStatus,
    handleSelectMessage,
    handleSelectAll,
    setActionType,
    setTargetId,
    toggleDialog,
  };
};
