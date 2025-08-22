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
import { ImageNode } from "./nodes/ImageNode";
import { YouTubeNode } from "./nodes/YouTubeNode";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { ImagesPlugin } from "./plugins/ImagesPlugin";
import { YouTubePlugin } from "./plugins/YouTubePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { HorizontalRuleNode } from "./nodes/HorizontalRuleNode";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
  disabled?: boolean;
}

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-gray-400",
  paragraph: "mb-2",
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
    h4: "text-lg font-bold mb-2",
    h5: "text-base font-bold mb-1",
    h6: "text-sm font-bold mb-1",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside mb-2",
    ul: "list-disc list-inside mb-2",
    listitem: "mb-1",
  },
  image: "max-w-full h-auto mx-auto block my-4",
  link: "text-blue-600 hover:text-blue-800 underline",
  text: {
    bold: "font-bold",
    italic: "italic",
    overflowed: "overflow-hidden",
    hashtag: "text-blue-500",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
    highlight: "bg-yellow-200 px-1 rounded",
  },
  code: "bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4",
  codeHighlight: {
    atrule: "text-purple-600",
    attr: "text-blue-600",
    boolean: "text-red-600",
    builtin: "text-purple-600",
    cdata: "text-gray-600",
    char: "text-green-600",
    class: "text-blue-600",
    "class-name": "text-blue-600",
    comment: "text-gray-500",
    constant: "text-red-600",
    deleted: "text-red-600",
    doctype: "text-gray-600",
    entity: "text-orange-600",
    function: "text-purple-600",
    important: "text-red-600",
    inserted: "text-green-600",
    keyword: "text-purple-600",
    namespace: "text-blue-600",
    number: "text-red-600",
    operator: "text-gray-700",
    prolog: "text-gray-600",
    property: "text-blue-600",
    punctuation: "text-gray-700",
    regex: "text-green-600",
    selector: "text-green-600",
    string: "text-green-600",
    symbol: "text-red-600",
    tag: "text-red-600",
    url: "text-blue-600",
    variable: "text-orange-600",
  },
  checklist: "list-none",
  "checklist-item": "flex items-center gap-2 mb-1",
};

function onError(error: Error) {
  console.error(error);
}

function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (value && isFirstRender) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor as unknown as any, dom);
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
  name,
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
    ] as unknown as ReadonlyArray<any>,
    editable: !disabled,
  };

  const handleChange = (
    editorState: any,
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
            <OnChangePlugin onChange={handleChange as unknown as any} />
            <InitialValuePlugin value={value} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <ImagesPlugin />
            <YouTubePlugin />
            <MarkdownShortcutPlugin
              transformers={TRANSFORMERS as unknown as any}
            />
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
