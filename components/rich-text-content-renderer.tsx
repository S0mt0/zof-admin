"use client";

import { cn } from "@/lib/utils";

type RichTextContentRendererProps = {
  content: string;
  className?: string;
};

function extractTextFromSerializedContent(value: unknown): string {
  if (!value || typeof value !== "object") return "";

  const node = value as {
    text?: unknown;
    children?: unknown;
    root?: unknown;
  };

  if (typeof node.text === "string") {
    return node.text;
  }

  const children = Array.isArray(node.children)
    ? node.children
    : node.root && typeof node.root === "object"
    ? [(node.root as { children?: unknown }).children].flat()
    : [];

  return children
    .map(extractTextFromSerializedContent)
    .filter(Boolean)
    .join(" ");
}

export function RichTextContentRenderer({
  content,
  className = "prose prose-base dark:prose-invert",
}: RichTextContentRendererProps) {
  if (!content) {
    return null;
  }

  if (content.trim().startsWith("{")) {
    try {
      const textContent = extractTextFromSerializedContent(JSON.parse(content));

      return (
        <div className={cn("min-w-full w-full max-w-full", className)}>
          {textContent || content}
        </div>
      );
    } catch {
      return (
        <div className={cn("min-w-full w-full max-w-full", className)}>
          {content}
        </div>
      );
    }
  }

  return (
    <div
      className={cn("min-w-full w-full max-w-full", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
