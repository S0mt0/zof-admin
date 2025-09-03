"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useOnClickOutside } from "usehooks-ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

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

  const cardRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(cardRef as React.RefObject<HTMLElement>, () =>
    toggleMessageModal()
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card
        className="overflow-y-auto max-h-screen w-full max-w-xl space-y-2 animate-in fade-in zoom-in duration-200"
        ref={cardRef}
      >
        <CardHeader>Message Details</CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b border-border pb-4">
            <CardDescription className="uppercase tracking-wide">
              Sender
            </CardDescription>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-neutral-300">
              {message.sender}
            </p>
            {message.email && (
              <p className="text-sm text-gray-500">({message.email})</p>
            )}
          </div>

          <div className="border-b border-border pb-4">
            <CardDescription className="uppercase tracking-wide">
              Subject
            </CardDescription>
            <p className="mt-2 text-lg text-gray-800 dark:text-neutral-300">
              {message.subject}
            </p>
          </div>

          <div>
            <CardDescription className="uppercase tracking-wide">
              Message
            </CardDescription>
            <div className="mt-3 p-5 bg-pink-50 dark:bg-green-100/20 dark:text-white rounded-xl text-gray-800 text-base leading-relaxed shadow-sm">
              {message.content}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={toggleMessageModal}
            className="hover:bg-primary hover:text-white"
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
