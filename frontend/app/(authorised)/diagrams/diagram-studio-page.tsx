"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Settings,
  Save,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDiagrams, useCreateDiagram, useUpdateDiagram } from "@/hooks/api-hooks";
import DiagramTypeSelector from "./diagram-type-selector";
import Toolbar from "./toolbar";
import ExportControls from "./export-controls";
import PropertiesPanel from "./properties-panel";
import DiagramCanvas from "./diagram-canvas";

export default function DiagramStudioPage() {
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentDiagramContent, setCurrentDiagramContent] = useState<string>('');
  const [isNewDiagram, setIsNewDiagram] = useState(true);

  // React Query hooks
  const { data: diagrams } = useDiagrams();
  const createDiagramMutation = useCreateDiagram();
  const updateDiagramMutation = useUpdateDiagram();

  const initialDiagram = `graph TD
    subgraph Level 0: Context Diagram
        User((User))
        WarehouseAPI[Warehouse API]
        NominatimAPI((Nominatim API))
        WarehouseDataStore((Warehouse Pincode Data Store))

        User --> WarehouseAPI
        WarehouseAPI --> NominatimAPI
        WarehouseAPI --> WarehouseDataStore
    end

    subgraph Level 1: Data Flow Diagram
        A[User]
        B(Find Nearest Warehouse)
        C(Calculate Distance)
        D(Get Coordinates)
        E((Warehouse Pincode Data Store))
        F[Nominatim API]

        A -->|Pincode, Warehouse Pincode List| B
        B -->|Nearest Warehouse Pincode| A

        A -->|Source Pincode, Destination Pincode| C
        C -->|Distance| A

        B -->|Pincode| D
        C -->|Pincode| D
        D --> F
        F -->|Coordinates| B
        F -->|Coordinates| C

        B --> E
    end`;

  // Initialize with default diagram on mount only
  useEffect(() => {
    setCurrentDiagramContent(initialDiagram);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once - initialDiagram is constant

  const handleSave = async (diagram: string) => {
    if (isNewDiagram) {
      // Create new diagram
      createDiagramMutation.mutate(
        {
          user_input: "Create diagram from studio",
          title: "Studio Diagram",
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
    setCurrentDiagramContent(initialDiagram);
  };

  // Function to load a diagram (can be used by PropertiesPanel or other components)
  const handleLoadDiagram = (diagramId: string) => {
    const diagram = diagrams?.find(d => d.id === diagramId);
    if (diagram) {
      setCurrentDiagramId(diagramId);
      setCurrentDiagramContent(diagram.content);
      setIsNewDiagram(false);
    }
  };

  const isSaving = createDiagramMutation.isPending || updateDiagramMutation.isPending;


  return (
    <div className="flex flex-col overflow-scroll bg-background text-foreground">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <BarChart className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold leading-tight">
                Diagram Studio
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Professional diagram editor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary">
              {diagrams?.length || 0} diagrams
            </Badge>
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
                {isSaving ? 'Saving...' : 'Save'}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 p-6 min-h-0 overflow-hidden">
        {/* Top Controls */}
        <div className="shrink-0 space-y-4">
          <DiagramTypeSelector />
          <Toolbar />
        </div>

        {/* Canvas and Properties Grid */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <DiagramCanvas 
              initialDiagram={currentDiagramContent} 
              onSave={handleSave}
              onChange={setCurrentDiagramContent}
            />
          </div>

          {/* Properties Panel */}
          <div className="shrink-0">
            <PropertiesPanel 
              diagrams={diagrams || []}
              onLoadDiagram={handleLoadDiagram}
              currentDiagramId={currentDiagramId}
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0">
          <ExportControls />
        </div>
      </main>
    </div>
  );
}
