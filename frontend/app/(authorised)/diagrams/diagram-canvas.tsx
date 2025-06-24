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
  onChange?: (diagram: string) => void
}

const GRID_BG_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px",
}

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style B fill:#fff3e0`

function DiagramCanvas({
  initialDiagram,
  onSave,
  onChange,
}: DiagramCanvasProps) {
  const [mermaidCode, setMermaidCode] = useState(initialDiagram || DEFAULT_DIAGRAM)

  // Update mermaidCode when initialDiagram changes
  useEffect(() => {
    if (initialDiagram && initialDiagram.trim()) {
      setMermaidCode(initialDiagram)
    } else if (!mermaidCode || !mermaidCode.trim()) {
      setMermaidCode(DEFAULT_DIAGRAM)
    }
  }, [initialDiagram, mermaidCode])
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
      fontFamily: "Inter, system-ui, sans-serif",
      themeVariables: {
        primaryColor: "#f9fafb",
        primaryTextColor: "#1f2937",
        primaryBorderColor: "#d1d5db",
        lineColor: "#6b7280",
        secondaryColor: "#f3f4f6",
        tertiaryColor: "#ffffff",
        background: "#ffffff",
        mainBkg: "#ffffff",
        secondBkg: "#f9fafb",
        tertiaryBkg: "#f3f4f6",
        cScale0: "#3b82f6",
        cScale1: "#8b5cf6",
        cScale2: "#10b981",
        cScale3: "#f59e0b",
        cScale4: "#ef4444",
        cScale5: "#8b5cf6",
        cScale6: "#06b6d4",
        cScale7: "#84cc16",
        cScale8: "#f97316",
        cScale9: "#ec4899",
        cScaleLabel0: "#ffffff",
        cScaleLabel1: "#ffffff",
        cScaleLabel2: "#ffffff",
        cScaleLabel3: "#ffffff",
        cScaleLabel4: "#ffffff",
        cScaleLabel5: "#ffffff",
        cScaleLabel6: "#ffffff",
        cScaleLabel7: "#ffffff",
        cScaleLabel8: "#ffffff",
        cScaleLabel9: "#ffffff"
      }
    })

    // Add global CSS for mermaid diagrams
    const style = document.createElement('style')
    style.textContent = `
      .diagram-content svg {
        max-width: 100% !important;
        height: auto !important;
        font-family: Inter, system-ui, sans-serif !important;
      }
      .diagram-content .node rect,
      .diagram-content .node circle,
      .diagram-content .node ellipse,
      .diagram-content .node polygon {
        stroke-width: 2px !important;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)) !important;
      }
      .diagram-content .edgePath .path {
        stroke-width: 2px !important;
        stroke-linecap: round !important;
      }
      .diagram-content .edgeLabel {
        background-color: rgba(255, 255, 255, 0.9) !important;
        border-radius: 4px !important;
        padding: 2px 6px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
      }
      .diagram-content text {
        font-size: 14px !important;
        font-weight: 500 !important;
        fill: #374151 !important;
      }
      .diagram-content .cluster rect {
        fill: #f9fafb !important;
        stroke: #d1d5db !important;
        stroke-width: 2px !important;
        rx: 8px !important;
      }
      .diagram-content .cluster text {
        font-weight: 600 !important;
        fill: #1f2937 !important;
      }
    `
    document.head.appendChild(style)

    const renderDiagram = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Basic syntax validation before rendering
        if (!mermaidCode || !mermaidCode.trim()) {
          console.log('Diagram code is empty, skipping render')
          setSvg("")
          setError(null)
          return
        }
        
        // Check for basic mermaid syntax
        const hasValidStart = /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|journey|gantt|pie|gitgraph|mindmap|timeline|sankey|block)/i.test(mermaidCode)
        if (!hasValidStart) {
          throw new Error('Diagram must start with a valid Mermaid diagram type (graph, flowchart, sequenceDiagram, etc.)')
        }
        
        // Generate unique ID to avoid conflicts
        const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(diagramId, mermaidCode)
        setSvg(svg)
        setError(null)
        
      } catch (error: unknown) {
        console.error('Mermaid rendering error:', error)
        setSvg("")
        
        let errorMessage = 'Error rendering diagram. Please check your Mermaid syntax.'
        
        try {
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage_ = (error as Error).message
            // Extract meaningful error messages
            if (errorMessage_.includes('Parse error')) {
              errorMessage = 'Syntax Error: Invalid Mermaid syntax. Check your diagram structure.'
            } else if (errorMessage_.includes('Lexical error')) {
              errorMessage = 'Syntax Error: Unexpected character or token in your diagram.'
            } else if (errorMessage_.includes('subgraph')) {
              errorMessage = 'Subgraph Error: Check your subgraph syntax and nesting.'
            } else if (errorMessage_.includes('node')) {
              errorMessage = 'Node Error: Check your node definitions and connections.'
            } else if (errorMessage_.toLowerCase().includes('empty')) {
              errorMessage = 'Empty Diagram: Please add some content to your diagram.'
            } else {
              errorMessage = `Error: ${errorMessage_}`
            }
          }
        } catch {
          // Fallback if error processing fails
          errorMessage = 'Error rendering diagram. Please check your Mermaid syntax.'
        }
        
        setError(errorMessage)
        
        // Show toast notification for errors - wrapped in try-catch
        try {
          toast({
            title: "Diagram Rendering Failed",
            description: errorMessage,
            variant: "destructive",
          })
        } catch (toastError) {
          console.error('Toast error:', toastError)
        }
        
      } finally {
        setLoading(false)
      }
    }

    renderDiagram()

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [mermaidCode])

  // Call onChange when mermaidCode changes (excluding initial load)
  const isInitializedRef = useRef(false)
  useEffect(() => {
    if (isInitializedRef.current) {
      onChange?.(mermaidCode)
    } else {
      isInitializedRef.current = true
    }
  }, [mermaidCode, onChange])

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
    } catch {
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

  // Error boundary wrapper
  if (error && !svg && !loading) {
    return (
      <Card className="flex-1 shadow-sm rounded-xl">
        <CardContent className="p-6 h-full">
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <Code className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-destructive">Diagram Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    setError(null);
                    setIsEditMode(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Edit Code
                </Button>
                <Button
                  onClick={() => {
                    setMermaidCode(DEFAULT_DIAGRAM);
                    setError(null);
                  }}
                  variant="default"
                  size="sm"
                >
                  Reset to Default
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex-1 shadow-sm rounded-xl">
      <CardContent className="p-0 h-full">
        <div className="relative h-full min-h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
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
                  <div className="w-full h-full p-6 overflow-auto">
                    <div className="flex items-center justify-center min-h-full">
                      <div
                        dangerouslySetInnerHTML={{ __html: svg }}
                        className="diagram-content bg-white rounded-lg shadow-lg p-6 border border-gray-200 max-w-full overflow-auto"
                        role="img"
                        aria-label="Rendered Mermaid Diagram"
                        style={{
                          filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))',
                          minWidth: 'fit-content'
                        }}
                      />
                    </div>
                  </div>
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
