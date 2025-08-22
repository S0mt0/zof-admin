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
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { $createTextNode, TextNode } from "lexical";
import { X, Check } from "lucide-react";
import { handleFileUpload } from "@/lib/utils/helpers.utils";
import { toast } from "sonner";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

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

      // Determine element alignment format safely across node types
      const formatGetter =
        (
          element as unknown as {
            getFormatType?: () => string;
            getFormat?: () => string;
          }
        ).getFormatType ||
        (element as unknown as { getFormat?: () => string }).getFormat;
      const nextFormat =
        typeof formatGetter === "function"
          ? formatGetter.call(element)
          : undefined;
      setElementFormat(nextFormat || "left");
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
          $setBlocksType(selection, () => $createCodeNode() as unknown as any);
        }
      });
    }
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
    applyStyleToSelection({ "font-size": `${newSize}px` });
  };

  const applyStyleToSelection = (styles: Record<string, string>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styles);
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

        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
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
            textNode.setStyle("");
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

  const doInsertImageWithUrl = (url: string, alt = "Image") => {
    editor.update(() => {
      const imageNode = $createImageNode({
        altText: alt,
        src: url,
      });
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([imageNode]);
      }
    });
    editor.focus();
  };

  const handleDeviceFileChosen: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const maxBytes = 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("Image must be 8MB or less.");
      return;
    }

    try {
      const dismiss = toast.loading("Uploading image...");
      let uploadedUrl: string | undefined;
      if (onImageUpload) {
        uploadedUrl = await onImageUpload(file);
      } else {
        const syntheticEvent = {
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        uploadedUrl = await handleFileUpload(syntheticEvent, "documents");
      }
      if (uploadedUrl) {
        doInsertImageWithUrl(uploadedUrl, file.name);
        toast.success("Image uploaded");
      } else {
        toast.error("Failed to upload image");
      }
      toast.dismiss(dismiss);
      setIsImagePopoverOpen(false);
    } catch (err) {
      console.error("Failed to upload image:", err);
      toast.error("Failed to upload image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleInsertImageFromUrl = () => {
    if (!imageUrlInput.trim()) return;
    try {
      // Basic URL validation
      new URL(imageUrlInput.trim());
      doInsertImageWithUrl(imageUrlInput.trim());
      setImageUrlInput("");
      setIsImagePopoverOpen(false);
    } catch {
      alert("Please enter a valid image URL.");
    }
  };

  const getYouTubeVideoID = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
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
      default:
        return "Normal";
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/40">
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

        <div className="w-px h-6 bg-border mx-1" />

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
            applyStyleToSelection({ "font-family": value });
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

        <div className="w-px h-6 bg-border mx-1" />

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

        <div className="w-px h-6 bg-border mx-1" />

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
                    applyStyleToSelection({ color: e.target.value });
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
                    applyStyleToSelection({
                      "background-color": e.target.value,
                    });
                  }}
                  className="w-full h-8 rounded border"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Insert Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Insert
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setIsImagePopoverOpen(true)}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.update(() => {
                  const hrNode = $createHorizontalRuleNode();
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    selection.insertNodes([hrNode]);
                  }
                });
                editor.focus();
              }}
            >
              Horizontal Rule
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
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
                    editor.focus();
                  } else {
                    alert("Invalid YouTube URL");
                  }
                }
              }}
            >
              YouTube Video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Image Popover */}
        {isImagePopoverOpen && (
          <div className="relative">
            <Popover
              open={isImagePopoverOpen}
              onOpenChange={setIsImagePopoverOpen}
            >
              <PopoverTrigger asChild>
                <span />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From device</label>
                    <Input
                      ref={fileInputRef as any}
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceFileChosen}
                    />
                    <p className="text-xs text-muted-foreground">
                      Images only, up to 8MB.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From URL</label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleInsertImageFromUrl();
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsImagePopoverOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleInsertImageFromUrl}>
                        Insert
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
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
