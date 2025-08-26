import { memo } from "react";

import { Input } from "@/components/ui/input";

export const TitleInput = memo(
  ({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
  }) => (
    <div className="space-y-1">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Enter your blog post title..."
        className="text-lg font-medium"
        maxLength={100}
        disabled={disabled}
      />
      <div className="text-xs text-muted-foreground text-right">
        {100 - value.length} characters remaining
      </div>
    </div>
  )
);

TitleInput.displayName = "TitleInput";
