import React, {
  useState,
  useRef,
  MouseEvent,
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
} from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  DraftHandleValue,
  DraftEditorCommand,
  ContentBlock,
  ContentState,
  DraftBlockRenderConfig,
  DraftBlockType,
  Modifier,
  AtomicBlockUtils,
} from "draft-js";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Link,
  Image,
  Video,
  Youtube,
  Minus,
  IndentIncrease,
  IndentDecrease,
  Type,
  Palette,
  Highlighter,
  ChevronDown,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Separator } from "@radix-ui/react-separator";

// ----------------------------
// Types
// ----------------------------

interface ToolbarButtonProps {
  active: boolean;
  onToggle: () => void;
  label: string;
  icon: FC<{ size?: number }>;
  disabled?: boolean;
}

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  icon: FC<{ size?: number }>;
}

interface FontFamilySelectorProps {
  onFontChange: (font: string) => void;
  currentFont: string | null;
}

interface MediaComponentProps {
  block: ContentBlock;
  contentState: ContentState;
}

// ----------------------------
// Toolbar Button Component
// ----------------------------
const ToolbarButton: FC<ToolbarButtonProps> = ({
  active,
  onToggle,
  label,
  icon: Icon,
  disabled = false,
}) => (
  <Button
    variant="ghost"
    size="sm"
    type="button"
    // className={cn(
    //   "p-2 rounded transition-colors hover:text-black",
    //   active && "bg-primary text-white",
    //   disabled && "opacity-50 cursor-not-allowed"
    // )}

    className={`p-2 rounded transition-colors hover:bg-gray-100 hover:text-black ${
      active
        ? "bg-primary text-white hover:bg-primary/80"
        : "hover:bg-gray-100 text-gray-700"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!disabled) onToggle();
    }}
    disabled={disabled}
    title={label}
  >
    <Icon size={16} />
  </Button>
);

// ----------------------------
// Color Picker Dropdown
// ----------------------------
const ColorPicker: FC<ColorPickerProps> = ({
  color,
  onChange,
  label,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>(color || "#000000");

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title={label}
      >
        <Icon size={16} />
        <div
          className="w-4 h-4 ml-1 border border-gray-300 rounded"
          style={{ backgroundColor: currentColor }}
        />
        <ChevronDown size={12} className="ml-1" />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          <HexColorPicker color={currentColor} onChange={handleColorChange} />
          <div className="mt-2 flex gap-2">
            <Input
              type="text"
              value={currentColor}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleColorChange(e.target.value)
              }
            />
            <Button
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setIsOpen(false);
              }}
              variant="ghost"
              size="sm"
              type="button"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------
// Font Family Selector
// ----------------------------
const FontFamilySelector: FC<FontFamilySelectorProps> = ({
  onFontChange,
  currentFont,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fonts: string[] = [
    "Arial, sans-serif",
    "Georgia, serif",
    "Times New Roman, serif",
    "Helvetica, sans-serif",
    "Courier New, monospace",
    "Verdana, sans-serif",
    "Impact, fantasy",
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <Type size={16} />
        <span className="ml-2 text-sm truncate">
          {currentFont ? currentFont.split(",")[0] : "Font"}
        </span>
        <ChevronDown size={12} className="ml-1" />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="ghost"
              size="sm"
              type="button"
              style={{ fontFamily: font }}
              onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                onFontChange(font);
                setIsOpen(false);
              }}
            >
              {font.split(",")[0]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------
// Media Component
// ----------------------------
const MediaComponent: FC<MediaComponentProps> = ({ block, contentState }) => {
  const entityKey = block.getEntityAt(0);
  if (!entityKey) return null;
  const entity = contentState.getEntity(entityKey);
  const {
    src,
    type,
    width = "100%",
    height = "auto",
  } = entity.getData() as {
    src: string;
    type: "IMAGE" | "VIDEO" | "YOUTUBE";
    width?: string;
    height?: string;
  };

  switch (type) {
    case "IMAGE":
      return (
        <div className="my-4">
          <img
            src={src}
            alt="Content"
            style={{ width, height, maxWidth: "100%" }}
            className="rounded h-auto object-cover object-center"
          />
        </div>
      );
    case "VIDEO":
      return (
        <div className="my-4">
          <video
            src={src}
            controls
            style={{ width, height, maxWidth: "100%" }}
            className="rounded"
          />
        </div>
      );
    case "YOUTUBE":
      return (
        <div className="my-4">
          <iframe
            src={`https://www.youtube.com/embed/${src}`}
            width={width}
            height={height || "315"}
            frameBorder={0}
            allowFullScreen
            className="rounded aspect-video"
          />
        </div>
      );
    default:
      return null;
  }
};

// ----------------------------
// Block Renderer
// ----------------------------

const blockRenderer: (block: ContentBlock) => DraftBlockRenderConfig | null = (
  block
) => {
  if (block.getType() === "atomic") {
    return {
      component: MediaComponent,
      editable: false,
      element: "div", // <-- REQUIRED NOW
    };
  }
  return null;
};

// ----------------------------
// Style Map
// ----------------------------
const styleMap: Record<string, React.CSSProperties> = {
  CODE: {
    backgroundColor: "#f3f4f6",
    fontFamily: "Courier New, monospace",
    padding: "2px 4px",
    borderRadius: "3px",
    fontSize: "0.9em",
  },
};

const getBlockStyle = (block: ContentBlock) => {
  const type = block.getType();
  const data = block.getData();

  let classes = "";

  switch (type) {
    case "blockquote":
      classes = "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4";
      break;
    case "code-block":
      classes =
        "bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto my-4";
      break;
    case "header-one":
      classes = "text-3xl font-bold my-4";
      break;
    case "header-two":
      classes = "text-2xl font-bold my-3";
      break;
    case "header-three":
      classes = "text-xl font-bold my-2";
      break;
    case "unstyled":
      classes = "my-2";
      break;
    default:
      classes = "my-2";
  }

  // Add text alignment
  const textAlign = data.get("textAlign");
  if (textAlign) {
    classes += ` text-${textAlign}`;
  }

  // Add indentation
  const indent = data.get("indent") || 0;
  if (indent > 0) {
    classes += ` ml-${indent * 6}`;
  }

  return classes;
};

// ----------------------------
// Rich Text Editor Component
// ----------------------------
const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("IMAGE");
  const editorRef = useRef<Editor>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

  // Focus editor
  const focus = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle key commands
  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Handle block type changes
  const handleBlockTypeChange = (blockType: DraftBlockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  // Handle inline style changes
  const handleInlineStyleChange = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  // Apply color styling
  const applyColor = (color: string, isBackground: boolean = false) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();

    const stylePrefix = isBackground ? "BGCOLOR_" : "COLOR_";
    const styleName = `${stylePrefix}${color.replace("#", "")}`;

    // Remove existing color styles
    let contentState = currentContent;
    const existingStyles = editorState.getCurrentInlineStyle();
    existingStyles.forEach((style) => {
      if (style?.startsWith(stylePrefix)) {
        contentState = Modifier.removeInlineStyle(
          contentState,
          selection,
          style
        );
      }
    });

    // Apply new color style
    contentState = Modifier.applyInlineStyle(
      contentState,
      selection,
      styleName
    );

    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-inline-style"
    );
    setEditorState(newEditorState);

    // Update style map
    if (isBackground) {
      styleMap[styleName] = { backgroundColor: color };
    } else {
      styleMap[styleName] = { color: color };
    }
  };

  // Apply font family
  const applyFontFamily = (fontFamily: string) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();

    // Remove existing font family styles
    let contentState = currentContent;
    const existingStyles = editorState.getCurrentInlineStyle();
    existingStyles.forEach((style) => {
      if (style?.startsWith("FONTFAMILY_")) {
        contentState = Modifier.removeInlineStyle(
          contentState,
          selection,
          style
        );
      }
    });

    const styleName = `FONTFAMILY_${fontFamily.replace(/[^a-zA-Z0-9]/g, "_")}`;
    contentState = Modifier.applyInlineStyle(
      contentState,
      selection,
      styleName
    );

    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "change-inline-style"
    );
    setEditorState(newEditorState);

    styleMap[styleName] = { fontFamily: fontFamily };
  };

  // Handle text alignment
  const handleTextAlign = (alignment: string) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const newBlockData = block.getData().merge({ textAlign: alignment });

    const newContentState = Modifier.mergeBlockData(
      currentContent,
      selection,
      newBlockData
    );

    setEditorState(
      EditorState.push(editorState, newContentState, "change-block-data")
    );
  };

  // Handle indentation
  const handleIndent = (increase = true) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = currentContent.getBlockForKey(blockKey);
    const currentIndent = block.getData().get("indent") || 0;
    const newIndent = increase
      ? Math.min(currentIndent + 1, 5)
      : Math.max(currentIndent - 1, 0);

    const newBlockData = block.getData().merge({ indent: newIndent });

    const newContentState = Modifier.mergeBlockData(
      currentContent,
      selection,
      newBlockData
    );

    setEditorState(
      EditorState.push(editorState, newContentState, "change-block-data")
    );
  };

  // Add link
  const addLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      alert("Please select some text to create a link");
      return;
    }
    setShowLinkInput(true);
  };

  const confirmLink = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      {
        url: linkUrl,
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    setShowLinkInput(false);
    setLinkUrl("");
  };

  // Handle image upload
  const handleImageUpload = useCallback((file: File) => {
    // This is where you would typically upload to your server
    // For demo purposes, we'll create a local URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        insertMedia(result, "IMAGE");
      }
    };
    reader.readAsDataURL(file);

    // In a real application, you would do something like:
    // const formData = new FormData();
    // formData.append('image', file);
    // fetch('/api/upload', { method: 'POST', body: formData })
    //   .then(response => response.json())
    //   .then(data => insertMedia(data.url, 'IMAGE'));
  }, []);

  // Insert media
  const insertMedia = (src: string, type: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      type,
      "IMMUTABLE",
      {
        src,
        type,
      }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  const confirmMedia = () => {
    if (mediaType === "YOUTUBE") {
      // Extract YouTube ID from URL
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = mediaUrl.match(regExp);
      const videoId = match && match[7].length === 11 ? match[7] : false;
      if (videoId) {
        insertMedia(videoId, "YOUTUBE");
      } else {
        alert("Invalid YouTube URL");
        return;
      }
    } else {
      insertMedia(mediaUrl, mediaType);
    }

    setShowMediaInput(false);
    setMediaUrl("");
  };

  // Insert horizontal rule
  const insertHorizontalRule = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "HR",
      "IMMUTABLE",
      {}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
    );
  };

  // Get current styles
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  // Get current colors
  const getCurrentColor = (prefix: string) => {
    const style = currentStyle.find(
      (s) => typeof s === "string" && s.startsWith(prefix)
    );
    return style ? `#${style.replace(prefix, "")}` : "#000000";
  };

  // Get current font family
  const getCurrentFontFamily = () => {
    const style = currentStyle.find(
      (s) => typeof s === "string" && s.startsWith("FONTFAMILY_")
    );
    if (style) {
      return style.replace("FONTFAMILY_", "").replace(/_/g, " ");
    }
    return null;
  };

  return (
    <Card>
      {/* Toolbar */}
      <CardHeader>
        <div className="flex flex-wrap gap-1 items-center">
          {/* Font Family */}
          <FontFamilySelector
            onFontChange={applyFontFamily}
            currentFont={getCurrentFontFamily()}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Text Formatting */}
          <ToolbarButton
            active={currentStyle.has("BOLD")}
            onToggle={() => handleInlineStyleChange("BOLD")}
            label="Bold"
            icon={Bold}
          />
          <ToolbarButton
            active={currentStyle.has("ITALIC")}
            onToggle={() => handleInlineStyleChange("ITALIC")}
            label="Italic"
            icon={Italic}
          />
          <ToolbarButton
            active={currentStyle.has("UNDERLINE")}
            onToggle={() => handleInlineStyleChange("UNDERLINE")}
            label="Underline"
            icon={Underline}
          />
          <ToolbarButton
            active={currentStyle.has("STRIKETHROUGH")}
            onToggle={() => handleInlineStyleChange("STRIKETHROUGH")}
            label="Strikethrough"
            icon={Strikethrough}
          />
          <ToolbarButton
            active={currentStyle.has("CODE")}
            onToggle={() => handleInlineStyleChange("CODE")}
            label="Inline Code"
            icon={Code}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Colors */}
          <ColorPicker
            color={getCurrentColor("COLOR_")}
            onChange={(color) => applyColor(color, false)}
            label="Text Color"
            icon={Palette}
          />
          <ColorPicker
            color={getCurrentColor("BGCOLOR_")}
            onChange={(color) => applyColor(color, true)}
            label="Background Color"
            icon={Highlighter}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Block Types */}
          <ToolbarButton
            active={blockType === "header-one"}
            onToggle={() => handleBlockTypeChange("header-one")}
            label="Header 1"
            icon={() => <span className="font-bold">H1</span>}
          />
          <ToolbarButton
            active={blockType === "header-two"}
            onToggle={() => handleBlockTypeChange("header-two")}
            label="Header 2"
            icon={() => <span className="font-bold">H2</span>}
          />
          <ToolbarButton
            active={blockType === "header-three"}
            onToggle={() => handleBlockTypeChange("header-three")}
            label="Header 3"
            icon={() => <span className="font-bold">H3</span>}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Lists */}
          <ToolbarButton
            active={blockType === "unordered-list-item"}
            onToggle={() => handleBlockTypeChange("unordered-list-item")}
            label="Bullet List"
            icon={List}
          />
          <ToolbarButton
            active={blockType === "ordered-list-item"}
            onToggle={() => handleBlockTypeChange("ordered-list-item")}
            label="Numbered List"
            icon={ListOrdered}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Alignment */}
          <ToolbarButton
            active={false}
            onToggle={() => handleTextAlign("left")}
            label="Align Left"
            icon={AlignLeft}
          />
          <ToolbarButton
            active={false}
            onToggle={() => handleTextAlign("center")}
            label="Align Center"
            icon={AlignCenter}
          />
          <ToolbarButton
            active={false}
            onToggle={() => handleTextAlign("right")}
            label="Align Right"
            icon={AlignRight}
          />
          <ToolbarButton
            active={false}
            onToggle={() => handleTextAlign("justify")}
            label="Justify"
            icon={AlignJustify}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Indentation */}
          <ToolbarButton
            active={false}
            onToggle={() => handleIndent(false)}
            label="Decrease Indent"
            icon={IndentDecrease}
          />
          <ToolbarButton
            active={false}
            onToggle={() => handleIndent(true)}
            label="Increase Indent"
            icon={IndentIncrease}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Special Blocks */}
          <ToolbarButton
            active={blockType === "blockquote"}
            onToggle={() => handleBlockTypeChange("blockquote")}
            label="Quote"
            icon={Quote}
          />
          <ToolbarButton
            active={blockType === "code-block"}
            onToggle={() => handleBlockTypeChange("code-block")}
            label="Code Block"
            icon={Code2}
          />

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Media */}
          <ToolbarButton
            active={false}
            onToggle={addLink}
            label="Add Link"
            icon={Link}
          />
          <ToolbarButton
            active={false}
            onToggle={() => fileInputRef.current?.click()}
            label="Upload Image"
            icon={Image}
          />
          <ToolbarButton
            active={false}
            onToggle={() => {
              setMediaType("VIDEO");
              setShowMediaInput(true);
            }}
            label="Add Video"
            icon={Video}
          />
          <ToolbarButton
            active={false}
            onToggle={() => {
              setMediaType("YOUTUBE");
              setShowMediaInput(true);
            }}
            label="YouTube Video"
            icon={Youtube}
          />
          <ToolbarButton
            active={false}
            onToggle={insertHorizontalRule}
            label="Horizontal Rule"
            icon={Minus}
          />
        </div>
      </CardHeader>

      {/* Link Input Modal */}
      {showLinkInput && (
        <div className="border-b border-border p-3 bg-background">
          <div className="flex gap-2 items-center">
            <Input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              autoFocus
            />
            <Button onClick={confirmLink}>Add Link</Button>
            <Button onClick={() => setShowLinkInput(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Media Input Modal */}
      {showMediaInput && (
        <div className="border-b border-border p-3 bg-background">
          <div className="flex gap-2 items-center">
            <Input
              type="url"
              placeholder={`Enter ${mediaType.toLowerCase()} URL...`}
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              autoFocus
            />
            <Button onClick={confirmMedia}>Add {mediaType}</Button>
            <Button
              variant={"outline"}
              onClick={() => setShowMediaInput(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const files = e?.target?.files;
          const file = files && files[0];
          if (file) {
            handleImageUpload(file);
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {/* Editor */}
      <CardContent className="min-h-96 p-6 cursor-text" onClick={focus}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          blockRendererFn={blockRenderer}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          placeholder="Write your content..."
          spellCheck={true}
        />
      </CardContent>

      {/* Status Bar */}
      <CardFooter className="border-t py-2">
        Characters: {editorState.getCurrentContent().getPlainText("").length}
      </CardFooter>
    </Card>
  );
};

export default RichTextEditor;
