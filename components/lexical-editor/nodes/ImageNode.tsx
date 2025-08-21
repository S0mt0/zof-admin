import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical"
import type React from "react" // Import React to declare JSX
import { $applyNodeReplacement, DecoratorNode } from "lexical"

export interface ImagePayload {
  altText: string
  height?: number
  key?: NodeKey
  src: string
  width?: number
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode
    const node = $createImageNode({ altText, height, src, width })
    return { node }
  }
  return null
}

export type SerializedImageNode = Spread<
  {
    altText: string
    height?: number
    src: string
    width?: number
  },
  SerializedLexicalNode
>

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  // Use React.JSX.Element instead of JSX.Element
  __src: string
  __altText: string
  __width: "inherit" | number
  __height: "inherit" | number

  static getType(): string {
    return "image"
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key)
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, src } = serializedNode
    const node = $createImageNode({
      altText,
      height,
      src,
      width,
    })
    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img")
    element.setAttribute("src", this.__src)
    element.setAttribute("alt", this.__altText)
    element.setAttribute("width", this.__width.toString())
    element.setAttribute("height", this.__height.toString())
    element.style.display = "block"
    element.style.margin = "0 auto"
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    }
  }

  constructor(src: string, altText: string, width?: "inherit" | number, height?: "inherit" | number, key?: NodeKey) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width || "inherit"
    this.__height = height || "inherit"
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === "inherit" ? 0 : this.__height,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    }
  }

  setWidthAndHeight(width: "inherit" | number, height: "inherit" | number): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span")
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate(): React.JSX.Element {
    // Use React.JSX.Element instead of JSX.Element
    return (
      <img
        src={this.__src || "/placeholder.svg"}
        alt={this.__altText}
        style={{
          height: this.__height === "inherit" ? "inherit" : this.__height,
          width: this.__width === "inherit" ? "inherit" : this.__width,
          display: "block",
          margin: "0 auto",
        }}
        className="max-w-full h-auto"
      />
    )
  }
}

export function $createImageNode({ altText, height, src, width, key }: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height, key))
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}
