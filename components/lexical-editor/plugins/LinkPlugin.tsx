"use client"

import type React from "react"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import { $getSelection, $isRangeSelection } from "lexical"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Check } from "lucide-react"

interface LinkEditorProps {
  editor: any
  onClose: () => void
}

function LinkEditor({ editor, onClose }: LinkEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")

  const handleSubmit = useCallback(() => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
    }
    onClose()
  }, [editor, linkUrl, onClose])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSubmit()
    } else if (event.key === "Escape") {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-white border rounded-lg shadow-lg">
      <Input
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://"
        className="w-64"
        autoFocus
      />
      <Button size="sm" variant="ghost" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={handleSubmit}>
        <Check className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function useLinkEditor() {
  const [editor] = useLexicalComposerContext()
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)

  const insertLink = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsLinkEditMode(true)
    }
  }, [])

  return {
    isLinkEditMode,
    setIsLinkEditMode,
    insertLink,
    LinkEditor: isLinkEditMode ? (
      <div className="absolute top-full left-0 mt-2 z-50">
        <LinkEditor editor={editor} onClose={() => setIsLinkEditMode(false)} />
      </div>
    ) : null,
  }
}
