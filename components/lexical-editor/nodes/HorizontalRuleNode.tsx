import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  SerializedLexicalNode,
} from "lexical"
import type React from "react" // Import React for JSX

import { $applyNodeReplacement, DecoratorNode } from "lexical"

export type SerializedHorizontalRuleNode = SerializedLexicalNode

function convertHorizontalRuleElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLHRElement) {
    const node = $createHorizontalRuleNode()
    return { node }
  }
  return null
}

export class HorizontalRuleNode extends DecoratorNode<React.JSX.Element> {
  // Use React.JSX.Element instead of JSX.Element
  static getType(): string {
    return "horizontal-rule"
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key)
  }

  static importJSON(): HorizontalRuleNode {
    return $createHorizontalRuleNode()
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: convertHorizontalRuleElement,
        priority: 0,
      }),
    }
  }

  exportJSON(): SerializedHorizontalRuleNode {
    return {
      type: "horizontal-rule",
      version: 1,
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("hr")
    element.className = "my-4 border-gray-300"
    return { element }
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div")
    div.className = "my-4"
    return div
  }

  updateDOM(): false {
    return false
  }

  decorate(): React.JSX.Element {
    // Use React.JSX.Element instead of JSX.Element
    return <hr className="my-4 border-gray-300" />
  }
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return $applyNodeReplacement(new HorizontalRuleNode())
}

export function $isHorizontalRuleNode(node: LexicalNode | null | undefined): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode
}
