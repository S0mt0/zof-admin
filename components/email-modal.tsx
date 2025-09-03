"use client";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Textarea } from "./ui/textarea";

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(cardRef as React.RefObject<HTMLElement>, () => onClose());

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card
        className="w-full max-w-xl space-y-2 animate-in fade-in zoom-in duration-200"
        ref={cardRef}
      >
        <CardHeader>Send Email</CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">To</Label>
            <Input value={to} disabled />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Enter email subject"
              className="focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Message</Label>
            <Textarea
              value={message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="max-h-[10rem]"
              ref={textareaRef}
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 pt-2">
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
        </CardFooter>
      </Card>
    </div>
  );
}
