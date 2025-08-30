"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailModalProps {
  open: boolean;
  to: string;
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onClose: () => void;
  onSend: () => void;
  disabled?: boolean;
  pending?: boolean;
}

export default function EmailModal({
  open,
  to,
  subject,
  message,
  onSubjectChange,
  onMessageChange,
  onClose,
  onSend,
  disabled,
  pending,
}: EmailModalProps) {
  if (!open) return null;
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 space-y-8 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-semibold text-gray-800">Send Email</h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-600">To</Label>
            <Input value={to} disabled className="bg-gray-100 text-gray-700" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-600">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Enter email subject"
              className="focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-600">Message</Label>
            <textarea
              className="w-full border rounded-xl p-3 min-h-[140px] resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Write your message here..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={disabled}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={onSend}
            disabled={disabled || pending}
            className="px-5"
          >
            {pending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
