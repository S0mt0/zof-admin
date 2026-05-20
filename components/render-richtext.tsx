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
    let textContent: string | null = null;
    let parseError = false;

    try {
      textContent = extractTextFromSerializedContent(JSON.parse(content));
    } catch {
      parseError = true;
    }

    return (
      <div className={cn("min-w-full w-full max-w-full", className)}>
        {parseError ? content : textContent || content}
      </div>
    );
  }

  return (
    <div
      className={cn("min-w-full w-full max-w-full", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
