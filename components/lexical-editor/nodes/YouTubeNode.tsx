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
import type React from "react"; // Import React for JSX usage

import { $applyNodeReplacement, DecoratorNode } from "lexical";

export type SerializedYouTubeNode = Spread<
  {
    videoID: string;
  },
  SerializedLexicalNode
>;

function convertYoutubeElement(domNode: Node): null | DOMConversionOutput {
  const videoID = getYouTubeVideoID(domNode.textContent || "");
  if (videoID) {
    const node = $createYouTubeNode(videoID);
    return { node };
  }
  return null;
}

function getYouTubeVideoID(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : null;
}

export class YouTubeNode extends DecoratorNode<React.JSX.Element> {
  // Use React.JSX.Element instead of JSX.Element
  __id: string;

  static getType(): string {
    return "youtube";
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__key);
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    const node = $createYouTubeNode(serializedNode.videoID);
    return node;
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      type: "youtube",
      version: 1,
      videoID: this.__id,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("src")) {
          return null;
        }
        return {
          conversion: convertYoutubeElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe");
    element.setAttribute("src", `https://www.youtube.com/embed/${this.__id}`);
    element.setAttribute("width", "560");
    element.setAttribute("height", "315");
    element.setAttribute("frameborder", "0");
    element.setAttribute("allowfullscreen", "true");
    element.style.display = "block";
    element.style.margin = "0 auto";
    return { element };
  }

  constructor(id: string, key?: NodeKey) {
    super(key);
    this.__id = id;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    const theme = config.theme;
    const className = theme.embedBlock?.base || "";
    if (className !== undefined) {
      div.className = className;
    }
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return `https://www.youtube.com/watch?v=${this.__id}`;
  }

  decorate(): React.JSX.Element {
    // Use React.JSX.Element instead of JSX.Element
    return (
      <div className="flex justify-center my-4">
        <iframe
          width="700"
          height="394"
          src={`https://www.youtube.com/embed/${this.__id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
          title="YouTube video"
          className="!w-full !max-w-[700px] !aspect-video block mx-auto rounded-md shadow-lg my-8"
        />
      </div>
    );
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  const node = new YouTubeNode(videoID);

  const result = $applyNodeReplacement(node);

  return result;
}

export function $isYouTubeNode(
  node: LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
