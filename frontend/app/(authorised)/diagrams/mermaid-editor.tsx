"use client"

import { useRef } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import type { editor } from "monaco-editor"

interface MermaidEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MermaidEditor({ value, onChange }: MermaidEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor

    // Define a simple language for mermaid syntax highlighting
    monaco.languages.register({ id: "mermaid" })
    monaco.languages.setMonarchTokensProvider("mermaid", {
      tokenizer: {
        root: [
          [/graph|subgraph|end|flowchart|sequenceDiagram|classDiagram/, "keyword"],
          [/-->|---|==>|-.->/, "arrow"],
          [/\[|\]|$$|$$|<|>|\{|\}/, "bracket"],
          [/".*?"/, "string"],
          [/\d+/, "number"],
          [/\w+/, "identifier"],
        ],
      },
    })

    // Set editor options
    editor.updateOptions({
      minimap: { enabled: false },
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      wordWrap: "on",
      wrappingIndent: "same",
      automaticLayout: true,
    })
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="mermaid"
      value={value}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 14,
        tabSize: 2,
      }}
    />
  )
}

