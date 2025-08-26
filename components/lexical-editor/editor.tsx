"use client";

import { $getRoot, type EditorState, type LexicalEditor } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";

import { HorizontalRuleNode } from "./nodes/HorizontalRuleNode";
import { ImageNode } from "./nodes/ImageNode";
import { YouTubeNode } from "./nodes/YouTubeNode";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { ImagesPlugin } from "./plugins/ImagesPlugin";
import { YouTubePlugin } from "./plugins/YouTubePlugin";
import { theme } from "./theme";

function onError(error: Error) {
  console.error("editor_error: ", error);
}

function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (value && isFirstRender) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().select();
        $getRoot().clear();
        $getRoot().append(...nodes);
      });
      setIsFirstRender(false);
    }
  }, [editor, value, isFirstRender]);

  return null;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter some text...",
  name = "editor",
  onImageUpload,
  className = "",
  disabled = false,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: name,
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
      YouTubeNode,
      HorizontalRuleNode,
    ],
    editable: !disabled,
  };

  const handleChange = (
    editorState: EditorState,
    editor: LexicalEditor,
    _tags: Set<string>
  ) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange(htmlString);
    });
  };

  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-sm overflow-hidden ${className}`}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <div className="bg-card">
          <ToolbarPlugin onImageUpload={onImageUpload} disabled={disabled} />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[220px] p-4 outline-none resize-none overflow-auto prose max-w-none dark:prose-invert"
                  style={{ caretColor: disabled ? "transparent" : "auto" }}
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} />
            <InitialValuePlugin value={value} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <ImagesPlugin />
            <YouTubePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <AutoLinkPlugin
              matchers={[
                (text: string) => {
                  const match =
                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi.exec(
                      text
                    );
                  if (match) {
                    return {
                      index: match.index,
                      length: match[0].length,
                      text: match[0],
                      url: match[0],
                    };
                  }
                  return null;
                },
              ]}
            />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
