import { memo } from "react";

import { Textarea } from "@/components/ui/textarea";

export const ExcerptInput = memo(
  ({
    value,
    onChange,
    status,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
    status: string;
    disabled: boolean;
  }) => (
    <div className="space-y-1 w-full">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Brief description of your blog post..."
        rows={3}
        maxLength={300}
        disabled={disabled}
        className={
          value && value.length > 250
            ? "border-amber-300"
            : value && value.length < 20
            ? "border-red-300"
            : ""
        }
      />
      <div className="flex justify-between text-xs mt-1">
        <span className="text-muted-foreground">
          {status !== "draft"
            ? "Required for publishing (min 20 chars)"
            : "Optional for drafts"}
        </span>
        <span
          className={`${
            value && value.length > 250
              ? "text-amber-600"
              : value && value.length < 20
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {value ? value.length : 0}/300 characters
        </span>
      </div>
    </div>
  )
);

ExcerptInput.displayName = "ExcerptInput";
