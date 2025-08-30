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

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Send Email</h3>
        <div className="space-y-2">
          <Label>To</Label>
          <Input value={to} disabled />
        </div>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Input
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <textarea
            className="w-full border rounded-md p-2 min-h-[140px]"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={disabled}>
            Cancel
          </Button>
          <Button onClick={onSend} disabled={disabled || pending}>
            {pending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
