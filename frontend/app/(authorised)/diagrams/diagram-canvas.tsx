"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Maximize2, Minimize2, ZoomIn, ZoomOut, Grid3X3, Move } from "lucide-react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import mermaid from "mermaid";
import { toast } from "@/hooks/use-toast";
import CompactCanvasControls from "./compact-canvas-controls";
import MinimalEmptyState from "./minimal-empty-state";

interface DiagramCanvasProps {
  diagram?: string;
  onSave?: (diagram: string) => void;
  onChange?: (diagram: string) => void;
}

const GRID_BG_STYLE = {
  backgroundImage: `
    linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px",
};

function DiagramCanvas({ diagram, onSave, onChange }: DiagramCanvasProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.2);
  const [showGrid, setShowGrid] = useState(true);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const diagramRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "sans-serif",
    });

    const renderDiagram = async () => {
      if (!diagram) {
        setSvg("");
        setIsEditMode(false);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        setError(null);
        const { svg } = await mermaid.render("mermaid-diagram", diagram);
        setSvg(svg);
        onChange?.(diagram);
      } catch {
        setSvg("");
        setError("Error rendering diagram. Please check your Mermaid syntax.");
        toast({
          title: "Error rendering diagram",
          description: "Please check your Mermaid syntax.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    renderDiagram();
  }, [diagram, onChange]);

  // Call onChange when mermaidCode changes (excluding initial load)
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (isInitializedRef.current && diagram) {
      onChange?.(diagram);
    } else {
      isInitializedRef.current = true;
    }
  }, [diagram, onChange]);

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monaco.languages.register({ id: "mermaid" });
      monaco.languages.setMonarchTokensProvider("mermaid", {
        tokenizer: {
          root: [
            [
              /graph|subgraph|end|flowchart|sequenceDiagram|classDiagram/,
              "keyword",
            ],
            [/-->|---|==>|-.->/, "arrow"],
            [/\[|\]|$$|$$|<|>|\{|\}/, "bracket"],
            [/".*?"/, "string"],
            [/\d+/, "number"],
            [/\w+/, "identifier"],
          ],
        },
      });
      editor.updateOptions({
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        wrappingIndent: "same",
        automaticLayout: true,
        fontSize: 14,
        tabSize: 2,
      });
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!diagram) return;

    try {
      onSave?.(diagram);
      toast({
        title: "Diagram saved",
        description: "Your diagram has been saved successfully.",
      });
    } catch {
      toast({
        title: "Error saving diagram",
        description: "There was an error saving your diagram.",
        variant: "destructive",
      });
    }
  }, [diagram, onSave]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mmd,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange?.(content);
          toast({
            title: "Diagram imported",
            description: "Your diagram has been imported successfully.",
          });
        };
        reader.readAsText(file);
      }
      // Clean up input element
      setTimeout(() => input.remove(), 0);
    };
    document.body.appendChild(input);
    input.click();
  }, [onChange]);

  const handleExport = useCallback(() => {
    if (!diagram) return;
    const blob = new Blob([diagram], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.mmd";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Diagram exported",
      description: "Your diagram has been exported successfully.",
    });
  }, [diagram]);

  const handleToggleFullscreen = useCallback(() => {
    if (!canvasRef.current) return;
    
    if (!isFullscreen) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.2, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(1.2);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  // Handle mouse events for panning with boundaries
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
    }
  }, [zoomLevel, panPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();
      const maxPan = 200 * (zoomLevel - 1); // Dynamic boundaries based on zoom
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPanPosition({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY))
      });
    }
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(4, prev + delta)));
    }
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <Card className={`flex-1 shadow-sm rounded-xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <CardContent className="p-0 h-full">
        <div 
          ref={canvasRef}
          className={`relative h-full rounded-lg overflow-hidden ${isFullscreen ? 'min-h-screen bg-white' : 'min-h-[400px] bg-gradient-to-br from-background to-muted/20'}`}
        >
          {/* Grid Background */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={GRID_BG_STYLE}
            />
          )}

          {/* Canvas Content */}
          <div className="absolute inset-0 z-10">
            {isEditMode ? (
              <div className="h-full p-4">
                <Editor
                  height="100%"
                  language="mermaid"
                  value={diagram}
                  onChange={(value) => onChange?.(value || "")}
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
              <div className="h-full p-6 overflow-hidden flex items-center justify-center" style={{ padding: isFullscreen ? '2rem' : '1.5rem' }}>
                {error ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                      <Code className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-lg font-semibold text-destructive">
                        Syntax Error
                      </h3>
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
                    <span className="text-muted-foreground">
                      Rendering diagram...
                    </span>
                  </div>
                ) : svg ? (
                  <div
                    ref={diagramRef}
                    className={`w-full h-full flex items-center justify-center transition-transform duration-150 ${zoomLevel > 1.1 ? 'cursor-move' : 'cursor-default'} ${isDragging ? 'cursor-grabbing' : ''}`}
                    style={{ 
                      transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                      transformOrigin: 'center center'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    role="img"
                    aria-label="Rendered Mermaid Diagram"
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: svg }}
                      className="pointer-events-none select-none"
                      style={{ minWidth: '200px', minHeight: '100px' }}
                    />
                  </div>
                ) : (
                  <MinimalEmptyState
                    onStartEditing={() => setIsEditMode(true)}
                    onImport={handleImport}
                  />
                )}
              </div>
            )}
          </div>

          {/* Canvas Controls */}
          <CompactCanvasControls
            isEditMode={isEditMode}
            loading={loading}
            onToggleMode={() => setIsEditMode((prev) => !prev)}
            onSave={handleSave}
            onExport={handleExport}
          />
          
          {/* Additional Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            {/* Fullscreen Toggle */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggleFullscreen}
                className="relative bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Grid Toggle */}
            <div className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur transition-opacity duration-300 ${
                showGrid ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'
              }`} />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggleGrid}
                className={`relative bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                  showGrid ? 'text-teal-600' : 'text-gray-500'
                }`}
                title="Toggle Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Zoom Controls */}
          {!isEditMode && svg && (
            <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20">
              {/* Zoom In */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 4}
                  className="relative bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-emerald-600 hover:text-emerald-700 disabled:text-gray-400"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Zoom Reset */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleZoomReset}
                  className="relative bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs px-2 min-w-[50px] text-blue-600 hover:text-blue-700 font-mono"
                  title="Reset Zoom & Pan"
                >
                  {Math.round(zoomLevel * 100)}%
                </Button>
              </div>
              
              {/* Zoom Out */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="relative bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-red-600 hover:text-red-700 disabled:text-gray-400"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Pan Indicator */}
              {zoomLevel > 1.1 && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur opacity-60 transition-opacity duration-300" />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="relative bg-white/95 backdrop-blur-sm border-0 shadow-lg text-amber-600 cursor-default"
                    title="Drag to pan • Ctrl+Scroll to zoom"
                    disabled
                  >
                    <Move className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DiagramCanvas;
