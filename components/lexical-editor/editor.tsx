"use client";

import {
  $getRoot,
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  isHTMLElement,
  Klass,
  LexicalNode,
  ParagraphNode,
  TextNode,
  type EditorState,
  type LexicalEditor,
} from "lexical";
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
import { theme } from "./theme";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
  disabled?: boolean;
}

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll("[style],[class]"),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

function onError(error: Error) {
  console.error(error);
}

// const InitialValuePlugin = ({ value }: { value: string }) => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     if (value) {
//       editor.update(() => {
//         // Clear current state
//         const root = $getRoot();
//         root.clear();

//         // Convert HTML to nodes
//         const parser = new DOMParser();
//         const dom = parser.parseFromString(value, "text/html");
//         const nodes = $generateNodesFromDOM(editor, dom);

//         // Insert nodes properly
//         root.append(...nodes);
//       });
//     }
//   }, [value, editor]);

//   return null;
// };

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

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

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
    ],
    html: {
      export: exportMap,
      import: constructImportMap(),
    },
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

// https://youtu.be/d0GHrfvwDaU?si=lJOU5iEEHDdMyTfy
