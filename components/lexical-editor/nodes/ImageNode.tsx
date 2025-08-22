import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type React from "react"; // Import React to declare JSX
import { $applyNodeReplacement, DecoratorNode } from "lexical";

export interface ImagePayload {
  altText: string;
  caption?: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    let caption: string | undefined;

    // Check if the image is inside a figure with a figcaption
    const parent = domNode.parentElement;
    if (parent?.tagName === "FIGURE") {
      const figcaption = parent.querySelector("figcaption");
      if (figcaption) {
        caption = figcaption.textContent || undefined;
      }
    }

    const node = $createImageNode({ altText, caption, height, src, width });
    return { node };
  }
  return null;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption?: string;
    height?: number;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  // Use React.JSX.Element instead of JSX.Element
  __src: string;
  __altText: string;
  __caption?: string;
  __width: "inherit" | number;
  __height: "inherit" | number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__caption,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, caption, height, width, src } = serializedNode;
    const node = $createImageNode({
      altText,
      caption,
      height,
      src,
      width,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const container = document.createElement("figure");
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    element.style.display = "block";
    element.style.margin = "1rem auto";
    element.style.maxWidth = "700px";
    element.style.width = "100%";
    element.style.objectFit = "cover";
    element.style.objectPosition = "center";

    container.appendChild(element);

    if (this.__caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = this.__caption;
      caption.style.textAlign = "center";
      caption.style.fontSize = "0.875rem";
      caption.style.color = "var(--muted-foreground)";
      caption.style.marginTop = "0.5rem";
      caption.style.fontStyle = "italic";
      container.appendChild(caption);
    }

    return { element: container };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    caption?: string,
    width?: "inherit" | number,
    height?: "inherit" | number,
    key?: NodeKey
  ) {
    super(key);

    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height === "inherit" ? 0 : this.__height,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): React.JSX.Element {
    // Use React.JSX.Element instead of JSX.Element
    return (
      <div className="image-container">
        <img
          src={this.__src || "/placeholder.svg"}
          alt={this.__altText}
          style={{
            height: this.__height === "inherit" ? "inherit" : this.__height,
            width: this.__width === "inherit" ? "100%" : this.__width,
            display: "block",
            margin: "1rem auto",
          }}
          className="w-full max-w-[700px] h-auto block mx-auto object-cover object-center"
        />
        {this.__caption && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
            {this.__caption}
          </figcaption>
        )}
      </div>
    );
  }
}

export function $createImageNode({
  altText,
  caption,
  height,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  try {
    const node = new ImageNode(src, altText, caption, width, height, key);

    const result = $applyNodeReplacement(node);

    return result;
  } catch (error) {
    throw error;
  }
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
