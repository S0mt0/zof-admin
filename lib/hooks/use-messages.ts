import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  bulkDeleteMessagesAction,
  deleteMessageAction,
  markMessageAsRead,
  replyMessageAction,
} from "../actions/messages";

export const useMessages = (messages: IMessage[]) => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const [activeMessage, setActiveMessage] = useState<IMessage | null>();

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

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
    if (!confirm("Delete message?")) return;

    const loading = toast.loading("Deleting...");
    startTransition(() => {
      deleteMessageAction(id)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
          } else if (res?.success) {
            toast.success(res.success);
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

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedMessages.length} messages?`
      )
    ) {
      const loading = toast.loading("Deleting...");
      try {
        const result = await bulkDeleteMessagesAction(selectedMessages);
        if (result.success) {
          toast.success(result.success);
          setSelectedMessages([]);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Failed to delete messages");
      } finally {
        toast.dismiss(loading);
      }
    }
  };

  const openReplyModal = (message: IMessage) => {
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
      replyMessageAction(replyTo, replySubject, replyMessage)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
          } else if (res?.success) {
            toast.success(res.success);
            setReplyModalOpen((curr) => !curr);
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

  const readMessage = async (id: string) => {
    startTransition(() => {
      markMessageAsRead(id)
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
    handleBulkDelete,
    handleDelete,
    openReplyModal,
    sendReply,
    setReplySubject,
    setReplyMessage,
    setReplyModalOpen,
    toggleMessageModal,
    readMessage,
    handleSelectMessage,
    handleSelectAll,
  };
};
