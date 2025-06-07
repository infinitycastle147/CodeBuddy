"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Code, Save, Upload, Download } from "lucide-react"
import Editor, { type Monaco } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import mermaid from "mermaid"
import { toast } from "@/hooks/use-toast"

interface DiagramCanvasProps {
  initialDiagram?: string
  onSave?: (diagram: string) => void
}

const GRID_BG_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px",
}

function DiagramCanvas({
  initialDiagram = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E`,
  onSave,
}: DiagramCanvasProps) {
  const [mermaidCode, setMermaidCode] = useState(initialDiagram)
  const [isEditMode, setIsEditMode] = useState(false)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "sans-serif",
    })

    const renderDiagram = async () => {
      setLoading(true)
      try {
        setError(null)
        const { svg } = await mermaid.render("mermaid-diagram", mermaidCode)
        setSvg(svg)
      } catch (err) {
        setSvg("")
        setError("Error rendering diagram. Please check your Mermaid syntax.")
      } finally {
        setLoading(false)
      }
    }

    renderDiagram()
  }, [mermaidCode])

  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
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
    editor.updateOptions({
      minimap: { enabled: false },
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      wordWrap: "on",
      wrappingIndent: "same",
      automaticLayout: true,
      fontSize: 14,
      tabSize: 2,
    })
  }, [])

  const handleSave = useCallback(async () => {
    try {
      onSave?.(mermaidCode)
      toast({
        title: "Diagram saved",
        description: "Your diagram has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving diagram",
        description: "There was an error saving your diagram.",
        variant: "destructive",
      })
    }
  }, [mermaidCode, onSave])

  const handleImport = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".mmd,.txt"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setMermaidCode(content)
          toast({
            title: "Diagram imported",
            description: "Your diagram has been imported successfully.",
          })
        }
        reader.readAsText(file)
      }
      // Clean up input element
      setTimeout(() => input.remove(), 0)
    }
    document.body.appendChild(input)
    input.click()
  }, [])

  const handleExport = useCallback(() => {
    const blob = new Blob([mermaidCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "diagram.mmd"
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Diagram exported",
      description: "Your diagram has been exported successfully.",
    })
  }, [mermaidCode])

  return (
    <Card className="flex-1 shadow-sm rounded-xl">
      <CardContent className="p-0 h-full">
        <div className="relative h-full min-h-[500px] bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={GRID_BG_STYLE}
          />

          {/* Canvas Content */}
          <div className="absolute inset-0 z-10">
            {isEditMode ? (
              <div className="h-full p-4">
                <Editor
                  height="100%"
                  language="mermaid"
                  value={mermaidCode}
                  onChange={(value) => setMermaidCode(value || "")}
                  onMount={handleEditorDidMount}
                  theme="vs-light"
                  options={{
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: "none",
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-full p-4 overflow-auto flex items-center justify-center">
                {error ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                      <Code className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-lg font-semibold text-destructive">Syntax Error</h3>
                      <p className="text-muted-foreground">{error}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditMode(true)}
                      variant="outline"
                      size="sm"
                      aria-label="Edit Code"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Edit Code
                    </Button>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
                    <span className="text-muted-foreground">Rendering diagram...</span>
                  </div>
                ) : svg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="w-full h-full flex items-center justify-center"
                    role="img"
                    aria-label="Rendered Mermaid Diagram"
                  />
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Code className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-lg font-semibold">Start Creating</h3>
                      <p className="text-muted-foreground">
                        Create beautiful diagrams using Mermaid syntax. Switch to edit mode to start coding your diagram.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button
                        size="sm"
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center gap-1"
                        aria-label="Start Editing"
                      >
                        <Code className="w-4 h-4" />
                        Start Editing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleImport}
                        className="flex items-center gap-1"
                        aria-label="Import Diagram"
                      >
                        <Upload className="w-4 h-4" />
                        Import
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Canvas Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditMode((prev) => !prev)}
              title={isEditMode ? "Preview Mode" : "Edit Mode"}
              aria-label={isEditMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}
              disabled={loading}
            >
              {isEditMode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              title="Save Diagram"
              aria-label="Save Diagram"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              title="Export Diagram"
              aria-label="Export Diagram"
              disabled={loading}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DiagramCanvas
