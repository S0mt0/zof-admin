import { memo, useRef, useEffect } from "react";

import { Textarea } from "@/components/ui/textarea";

export const TitleInput = memo(
  ({
    value,
    onChange,
    disabled,
    maxLength = 200,
  }: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    maxLength?: number;
  }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (textareaRef.current) {
        const el = textareaRef.current;
        el.style.transition = "height 0.2s ease";
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
    }, [value]);

    return (
      <div className="space-y-1">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your event's name..."
          className="text-lg font-medium resize-none min-h-0 transition-all max-h-20 scrollbar-none"
          maxLength={maxLength}
          disabled={disabled}
          rows={1}
          required
        />
        <div className="text-xs text-muted-foreground text-right">
          {maxLength - value.length} characters remaining
        </div>
      </div>
    );
  }
);

TitleInput.displayName = "TitleInput";
