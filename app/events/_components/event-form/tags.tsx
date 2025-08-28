import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const TagsInput = memo(
  ({
    tags,
    newTag,
    onNewTagChange,
    onAddTag,
    onRemoveTag,
    disabled,
  }: {
    tags: string[];
    newTag: string;
    onNewTagChange: (value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    disabled: boolean;
  }) => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Add tag..."
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddTag();
            }
          }}
          disabled={disabled}
        />
        <Button
          type="button"
          onClick={onAddTag}
          size="sm"
          disabled={disabled || !newTag.trim()}
        >
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onRemoveTag(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
);

TagsInput.displayName = "TagsInput";
