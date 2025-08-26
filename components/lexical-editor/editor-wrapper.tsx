import { memo, useCallback, useRef } from "react";

import RichTextEditor from "./editor";

// Isolated editor wrapper to prevent focus issues
export const EditorWrapper = memo(
  ({
    value: content,
    onChange,
    disabled,
    name,
    placeholder,
    className,
    onImageUpload,
  }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Stable onChange handler
    const handleEditorChange = useCallback(
      (value: string) => {
        // Prevent unnecessary updates
        if (value !== content) {
          onChange(value);
        }
      },
      [content, onChange]
    );

    return (
      <div ref={editorRef}>
        <RichTextEditor
          name={name}
          value={content}
          onChange={handleEditorChange}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          onImageUpload={onImageUpload}
        />
        <div className="text-xs text-muted-foreground text-right mt-2">
          {content.replace(/<[^>]*>/g, "").length} characters
          {content.replace(/<[^>]*>/g, "").length < 100 &&
            " (minimum 100 required for publishing)"}
        </div>
      </div>
    );
  }
);

EditorWrapper.displayName = "EditorWrapper";
