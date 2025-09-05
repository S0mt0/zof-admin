"use client";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Button } from "./ui/button";

type Props = {
  onCancel: () => void;
  onOk: () => void;
  message?: string;
  isOpen: boolean;
};

export const AlertDialog = ({
  onCancel,
  onOk,
  message,
  isOpen = false,
}: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(cardRef as React.RefObject<HTMLElement>, () => onCancel());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card
        className="overflow-y-auto max-h-screen w-full max-w-md space-y-2 animate-in fade-in zoom-in duration-200"
        ref={cardRef}
      >
        <CardHeader className="flex-row gap-1.5 items-center font-bold">
          Please confirm <Info className="h-4 w-4" />
        </CardHeader>
        {message && (
          <CardContent className="space-y-4">
            <CardDescription className="text-sm tracking-wide">
              {message}
            </CardDescription>
          </CardContent>
        )}
        <CardFooter className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onOk} className="text-white">
            OK
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
