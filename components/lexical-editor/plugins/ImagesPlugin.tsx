"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { useEffect } from "react";
import { DRAG_DROP_PASTE } from "@lexical/rich-text";
import { ImageNode } from "../nodes/ImageNode";
import type { JSX } from "react";

export function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return editor.registerCommand<InputEvent>(
      DRAG_DROP_PASTE,
      (event) => {
        const [isFileTransfer] = eventFiles(event);
        if (isFileTransfer) {
          // Handle file drop/paste
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

function eventFiles(event: InputEvent): [boolean, Array<File>, boolean] {
  let dataTransfer: null | DataTransfer = null;
  let isComposing = false;
  let types: Set<string> = new Set();

  if (event.type === "dragover" || event.type === "drop") {
    dataTransfer = event?.dataTransfer;
  } else if (event.type === "paste") {
    dataTransfer = (event as unknown as ClipboardEvent).clipboardData;
    isComposing = event?.isComposing;
  }

  if (dataTransfer !== null) {
    types = new Set(dataTransfer.types);
  }

  const hasFiles = types.has("Files");
  const hasContent = types.has("text/html") || types.has("text/plain");

  return [hasFiles, [], hasContent && !isComposing];
}
