"use client";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ViewMessageModal({
  message,
  messageOpen,
  toggleMessageModal,
  markAsRead,
}: {
  message?: IMessage | null;
  toggleMessageModal: () => void;
  messageOpen: boolean;
  markAsRead: (id: string) => Promise<void>;
}) {
  if (!messageOpen) return null;
  if (!message) return null;

  useEffect(() => {
    if (message.status !== "read") {
      (async () => {
        await markAsRead(message.id);
      })();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Message</h3>
        <div className="space-y-2">
          <h2>Sender</h2>
          <p>{message.sender}</p>
        </div>
        <div className="space-y-2">
          <h2>Subject</h2>
          <p>{message.subject}</p>
        </div>
        <div className="space-y-2">
          <h2>Message</h2>
          <p>{message.content}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={toggleMessageModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
