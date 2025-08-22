"use client";

import type { JSX } from "react";
import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { YouTubeNode } from "../nodes/YouTubeNode";

export function YouTubePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode as unknown as any])) {
      throw new Error("YouTubePlugin: YouTubeNode not registered on editor");
    }
  }, [editor]);

  return null;
}
