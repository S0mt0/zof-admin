"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useCallback, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  ImageIcon,
  Youtube,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  ChevronDown,
  Type,
  Minus,
  Link,
  Table,
  RectangleHorizontalIcon as HorizontalRule,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { $createImageNode } from "../nodes/ImageNode";
import { $createYouTubeNode } from "../nodes/YouTubeNode";
import { $createHorizontalRuleNode } from "../nodes/HorizontalRuleNode";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { $createTextNode, TextNode } from "lexical";
import { X, Check } from "lucide-react";

interface ToolbarPluginProps {
  onImageUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
}

export function ToolbarPlugin({ onImageUpload, disabled }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontColor, setFontColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [elementFormat, setElementFormat] = useState("left");
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else {
        setBlockType(element.getType());
      }

      setElementFormat(element.getFormatTyp() || "left");
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [updateToolbar, editor]);

  const formatText = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    editor.focus();
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
    editor.focus();
  };

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
    editor.focus();
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
    editor.focus();
  };

  const formatCodeBlock = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    editor.focus();
  };

  const formatCheckList = () => {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    editor.focus();
  };

  const formatAlignment = (
    alignment: "left" | "center" | "right" | "justify" | "start" | "end"
  ) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    editor.focus();
  };

  const handleIndent = () => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    editor.focus();
  };

  const handleOutdent = () => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    editor.focus();
  };

  const changeFontSize = (increment: number) => {
    const newSize = Math.max(6, Math.min(72, fontSize + increment));
    setFontSize(newSize);
    applyStyleText({ fontSize: `${newSize}px` });
  };

  const applyStyleText = (styles: Record<string, string>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          const element = node.getParent();
          if (element) {
            const key = element.getKey();
            const domElement = editor.getElementByKey(key);
            if (domElement) {
              Object.assign(domElement.style, styles);
            }
          }
        });
      }
    });
    editor.focus();
  };

  const applyTextTransform = (transform: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        let transformedText = selectedText;

        switch (transform) {
          case "lowercase":
            transformedText = selectedText.toLowerCase();
            break;
          case "uppercase":
            transformedText = selectedText.toUpperCase();
            break;
          case "capitalize":
            transformedText = selectedText.replace(/\b\w/g, (l) =>
              l.toUpperCase()
            );
            break;
        }

        if (transformedText !== selectedText) {
          selection.insertText(transformedText);
        }
      }
    });
    editor.focus();
  };

  const toggleHighlight = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        const hasHighlight = nodes.some((node) => {
          if (node instanceof TextNode) {
            return node.hasFormat("highlight");
          }
          return false;
        });

        if (hasHighlight) {
          // Remove highlight
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        } else {
          // Add highlight
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        }
      }
    });
    editor.focus();
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.getTextContent()) {
            const textNode = $createTextNode(node.getTextContent());
            node.replace(textNode);
          }
        });
      }
    });
    editor.focus();
  };

  const insertLink = () => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Only enable the popup if there’s an actual text selection
        setIsLinkEditMode(true);
      }
    });
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
        url: linkUrl,
        target: "_blank",
      });
    }
    setIsLinkEditMode(false);
    setLinkUrl("");
    editor.focus();
  };

  const handleLinkCancel = () => {
    setIsLinkEditMode(false);
    setLinkUrl("");
    editor.focus();
  };

  const insertImage = async () => {
    if (!onImageUpload) {
      const url = prompt("Enter image URL:");
      if (url) {
        editor.update(() => {
          const imageNode = $createImageNode({
            altText: "Image",
            src: url,
          });
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode]);
          }
        });
      }
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImageUpload) {
        try {
          const url = await onImageUpload(file);
          editor.update(() => {
            const imageNode = $createImageNode({
              altText: file.name,
              src: url,
            });
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertNodes([imageNode]);
            }
          });
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    };
    input.click();
    editor.focus();
  };

  const insertInlineImage = async () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.update(() => {
        const imageNode = $createImageNode({
          altText: "Inline Image",
          src: url,
          width: 100,
          height: 100,
        });
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);
        }
      });
    }
    editor.focus();
  };

  const insertYouTube = () => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      const videoID = getYouTubeVideoID(url);
      if (videoID) {
        editor.update(() => {
          const youtubeNode = $createYouTubeNode(videoID);
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([youtubeNode]);
          }
        });
      } else {
        alert("Invalid YouTube URL");
      }
    }
    editor.focus();
  };

  const insertHorizontalRule = () => {
    editor.update(() => {
      const hrNode = $createHorizontalRuleNode();
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([hrNode]);
      }
    });
    editor.focus();
  };

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: "3", rows: "3" });
    editor.focus();
  };

  const getYouTubeVideoID = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const getBlockTypeLabel = () => {
    switch (blockType) {
      case "paragraph":
        return "Normal";
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "quote":
        return "Quote";
      case "code":
        return "Code Block";
      case "check-list-item":
        return "Check List";
      default:
        return "Normal";
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Block Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="text-sm">{getBlockTypeLabel()}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={formatParagraph}>
              <span className="flex items-center gap-2">
                <span className="text-sm">≡</span>
                Normal
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading("h1")}>
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold">H1</span>
                Heading 1
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading("h2")}>
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold">H2</span>
                Heading 2
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading("h3")}>
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold">H3</span>
                Heading 3
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
              }
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">1.</span>
                Numbered List
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
              }
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">•</span>
                Bullet List
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatCheckList}>
              <span className="flex items-center gap-2">
                <span className="text-sm">☑</span>
                Check List
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatQuote}>
              <span className="flex items-center gap-2">
                <span className="text-sm">"</span>
                Quote
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatCodeBlock}>
              <span className="flex items-center gap-2">
                <span className="text-sm">{"<>"}</span>
                Code Block
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family */}
        <Select
          value={fontFamily}
          onValueChange={(value) => {
            setFontFamily(value);
            applyStyleText({ fontFamily: value });
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>

        {/* Font Size */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => changeFontSize(-6)}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm w-8 text-center">{fontSize}</span>
          <Button variant="ghost" size="sm" onClick={() => changeFontSize(6)}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <Button
          variant={isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={isUnderline ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("underline")}
        >
          <Underline className="h-4 w-4" />
        </Button>

        {/* Link */}
        <Button variant="ghost" size="sm" onClick={insertLink}>
          <Link className="h-4 w-4" />
        </Button>

        {/* Text Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Type className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => applyTextTransform("lowercase")}>
              <span className="flex items-center gap-2">
                <span className="text-sm">abc</span>
                Lowercase
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTextTransform("uppercase")}>
              <span className="flex items-center gap-2">
                <span className="text-sm">ABC</span>
                Uppercase
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyTextTransform("capitalize")}>
              <span className="flex items-center gap-2">
                <span className="text-sm">Tt</span>
                Capitalize
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatText("strikethrough")}>
              <span className="flex items-center gap-2">
                <span className="text-sm line-through">S</span>
                Strikethrough
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatText("subscript")}>
              <span className="flex items-center gap-2">
                <span className="text-sm">X₂</span>
                Subscript
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatText("superscript")}>
              <span className="flex items-center gap-2">
                <span className="text-sm">X₂</span>
                Superscript
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleHighlight}>
              <span className="flex items-center gap-2">
                <span className="text-sm bg-yellow-200 px-1">H</span>
                Highlight
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={clearFormatting}>
              <span className="flex items-center gap-2">
                <span className="text-sm">🗑</span>
                Clear Formatting
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              {elementFormat === "left" && <AlignLeft className="h-4 w-4" />}
              {elementFormat === "center" && (
                <AlignCenter className="h-4 w-4" />
              )}
              {elementFormat === "right" && <AlignRight className="h-4 w-4" />}
              {elementFormat === "justify" && (
                <AlignJustify className="h-4 w-4" />
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => formatAlignment("left")}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Left Align
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatAlignment("center")}>
              <AlignCenter className="h-4 w-4 mr-2" />
              Center Align
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatAlignment("right")}>
              <AlignRight className="h-4 w-4 mr-2" />
              Right Align
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatAlignment("justify")}>
              <AlignJustify className="h-4 w-4 mr-2" />
              Justify Align
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatAlignment("start")}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Start Align
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatAlignment("end")}>
              <AlignRight className="h-4 w-4 mr-2" />
              End Align
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOutdent}>
              <span className="flex items-center gap-2">
                <span className="text-sm">⇤</span>
                Outdent
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleIndent}>
              <span className="flex items-center gap-2">
                <span className="text-sm">⇥</span>
                Indent
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Colors */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <div
                className="w-4 h-4 border rounded"
                style={{ backgroundColor: fontColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Text Color</label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => {
                    setFontColor(e.target.value);
                    applyStyleText({ color: e.target.value });
                  }}
                  className="w-full h-8 rounded border"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Background Color</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    applyStyleText({ backgroundColor: e.target.value });
                  }}
                  className="w-full h-8 rounded border"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insert Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Insert
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={insertHorizontalRule}>
              <HorizontalRule className="h-4 w-4 mr-2" />
              Horizontal Rule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertImage}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertInlineImage}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Inline Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertTable}>
              <Table className="h-4 w-4 mr-2" />
              Table
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertYouTube}>
              <Youtube className="h-4 w-4 mr-2" />
              YouTube Video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Link Editor Popup */}
      {isLinkEditMode && (
        <div className="absolute top-full left-0 mt-2 z-50">
          <div className="flex items-center gap-2 p-2 bg-white border rounded-lg shadow-lg">
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  handleLinkCancel();
                }
              }}
              placeholder="https://"
              className="w-64"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleLinkCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLinkSubmit}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
