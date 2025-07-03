"use client";

// External dependencies
import type React from "react";
import { useState } from "react";
import { BarChart, Settings, Save, Plus } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Custom hooks
import {
  useDiagrams,
  useCreateDiagram,
  useUpdateDiagram,
} from "@/hooks/api-hooks";

// Local components
import DiagramTypeSelector from "@/app/(authorised)/diagrams/diagram-type-selector";
import Toolbar from "@/app/(authorised)/diagrams/toolbar";
import ExportControls from "@/app/(authorised)/diagrams/export-controls";
// import PropertiesPanel from "@/app/(authorised)/diagrams/properties-panel";
import DiagramCanvas from "@/app/(authorised)/diagrams/diagram-canvas";

export default function DiagramStudioPage() {
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentDiagramContent, setCurrentDiagramContent] =
    useState<string>("");
  const [isNewDiagram, setIsNewDiagram] = useState(true);

  // React Query hooks
  const { data: diagrams } = useDiagrams();
  const createDiagramMutation = useCreateDiagram();
  const updateDiagramMutation = useUpdateDiagram();

  const handleSave = async (diagram: string) => {
    if (isNewDiagram) {
      // Create new diagram
      createDiagramMutation.mutate(
        {
          user_input: "Create diagram from studio",
          title: "Studio Diagram",
          type: "flowchart",
          description: "Diagram created in the studio",
        },
        {
          onSuccess: (newDiagram) => {
            setCurrentDiagramId(newDiagram.id);
            setIsNewDiagram(false);
            // Update the diagram content
            updateDiagramMutation.mutate({
              diagramId: newDiagram.id,
              content: diagram,
            });
          },
        }
      );
    } else if (currentDiagramId) {
      // Update existing diagram
      updateDiagramMutation.mutate({
        diagramId: currentDiagramId,
        content: diagram,
      });
    }
  };

  const handleNewDiagram = () => {
    setCurrentDiagramId(null);
    setIsNewDiagram(true);
    setCurrentDiagramContent("");
  };

  // Function to load a diagram (can be used by PropertiesPanel or other components)
  // const handleLoadDiagram = (diagramId: string) => {
  //   const diagram = diagrams?.find((d) => d.id === diagramId);
  //   if (diagram) {
  //     setCurrentDiagramId(diagramId);
  //     setCurrentDiagramContent(diagram.content);
  //     setIsNewDiagram(false);
  //   }
  // };

  const isSaving =
    createDiagramMutation.isPending || updateDiagramMutation.isPending;

  return (
    <div className="flex flex-col overflow-scroll bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-6 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Title and Description */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />

          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <BarChart className="w-4 h-4 text-primary-foreground" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight">Diagram Studio</h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Professional diagram editor
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary">{diagrams?.length || 0} diagrams</Badge>

          <Button
            onClick={handleNewDiagram}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>

          <Button
            onClick={() => handleSave(currentDiagramContent)}
            disabled={isSaving}
            size="sm"
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 p-6 min-h-0 overflow-hidden">
        
        {/* Top Controls */}
        <div className="shrink-0 space-y-4">
          <DiagramTypeSelector />
          <Toolbar
            onToolChange={(tool) => console.log("Tool changed:", tool)}
            onZoomChange={(zoom) => console.log("Zoom changed:", zoom)}
            onGridToggle={(show) => console.log("Grid toggled:", show)}
            onUndo={() => console.log("Undo action")}
            onSave={() => handleSave(currentDiagramContent)}
            onShare={() => console.log("Share action")}
            disabled={isSaving}
          />
        </div>

        {/* Canvas and Properties Grid */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <DiagramCanvas
              diagram={currentDiagramContent}
              onSave={handleSave}
              onChange={setCurrentDiagramContent}
            />
          </div>

          {/* Properties Panel */}
          {/* <div className="shrink-0">
            <PropertiesPanel
              diagrams={diagrams || []}
              onLoadDiagram={handleLoadDiagram}
              currentDiagramId={currentDiagramId}
            />
          </div> */}
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0">
          <ExportControls />
        </div>
      </main>
    </div>
  );
}
