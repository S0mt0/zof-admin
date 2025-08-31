"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ViewMessageModal({
  message,
  messageOpen,
  toggleMessageModal,
  handleToggleReadStatus,
}: {
  message?: IMessage | null;
  toggleMessageModal: () => void;
  messageOpen: boolean;
  handleToggleReadStatus: (id: string, status: MessageStatus) => Promise<void>;
}) {
  if (!messageOpen || !message) return null;

  useEffect(() => {
    if (message.status === "unread") {
      (async () => {
        await handleToggleReadStatus(message.id, "read");
      })();
    }
  }, [message.id, message.status, handleToggleReadStatus]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 space-y-8 animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-bold text-gray-900">Message Details</h3>

        <div className="space-y-6 text-gray-700">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Sender
            </h4>
            <p className="mt-2 text-lg font-medium text-gray-900">
              {message.sender}
            </p>
            {message.email && (
              <p className="text-sm text-gray-500">{message.email}</p>
            )}
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Subject
            </h4>
            <p className="mt-2 text-lg text-gray-800">{message.subject}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Message
            </h4>
            <div className="mt-3 p-5 bg-gray-50 rounded-xl text-gray-800 text-base leading-relaxed shadow-sm">
              {message.content}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={toggleMessageModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
