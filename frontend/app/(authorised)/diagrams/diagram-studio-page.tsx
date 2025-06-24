"use client";

// React and State Management
import type React from "react";
import { useState } from "react";

// Icons
import {
  BarChart,
  Settings,
  Save,
  Plus,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

// API Hooks
import { useDiagrams, useCreateDiagram, useUpdateDiagram } from "@/hooks/api-hooks";

// Diagram Studio Components
import DiagramTypeSelector from "./diagram-type-selector";
import Toolbar from "./toolbar";
import ExportControls from "./export-controls";
import PropertiesPanel from "./properties-panel";
import DiagramCanvas from "./diagram-canvas";

export default function DiagramStudioPage() {
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentDiagramContent, setCurrentDiagramContent] = useState<string>('');
  const [isNewDiagram, setIsNewDiagram] = useState(true);
  const [currentSvg, setCurrentSvg] = useState<string>('');

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
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SidebarTrigger />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <BarChart className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold leading-tight">
                Diagram Studio
              </h1>
              <p className="text-xs text-muted-foreground leading-tight">
                Professional diagram editor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="hidden md:inline-flex">
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
              <span className="hidden lg:inline">
                {isSaving ? 'Saving...' : 'Save'}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 lg:p-6 min-h-0 overflow-hidden">
        {/* Left Column - Controls and Canvas */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Top Controls - Responsive Stack */}
          <div className="shrink-0 space-y-4">
            <div className="block lg:hidden">
              <DiagramTypeSelector />
            </div>
            <Toolbar 
              onToolChange={(tool) => console.log('Tool changed:', tool)}
              onZoomChange={(zoom) => console.log('Zoom changed:', zoom)}
              onGridToggle={(show) => console.log('Grid toggled:', show)}
              onUndo={() => console.log('Undo action')}
              onSave={() => handleSave(currentDiagramContent)}
              onShare={() => console.log('Share action')}
              disabled={isSaving}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 min-h-0">
            <DiagramCanvas 
              diagram={currentDiagramContent} 
              onSave={handleSave}
              onChange={(content) => {
                setCurrentDiagramContent(content);
                // Extract SVG when content changes
                setTimeout(() => {
                  const svgElement = document.querySelector('.diagram-content svg');
                  if (svgElement) {
                    setCurrentSvg(svgElement.outerHTML);
                  }
                }, 500);
              }}
            />
          </div>

          {/* Bottom Controls - Export (Mobile) */}
          <div className="shrink-0 block lg:hidden">
            <ExportControls 
              diagramSvg={currentSvg}
              diagramCode={currentDiagramContent}
              fileName={`diagram-${currentDiagramId || 'new'}`}
            />
          </div>
        </div>

        {/* Right Column - Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-4 shrink-0">
          {/* Diagram Type Selector */}
          <div className="flex-1 min-h-0">
            <DiagramTypeSelector />
          </div>
          
          {/* Properties Panel */}
          <div className="flex-1 min-h-0">
            <PropertiesPanel 
              diagrams={diagrams || []}
              onLoadDiagram={handleLoadDiagram}
              currentDiagramId={currentDiagramId}
            />
          </div>
          
          {/* Export Controls */}
          <div className="shrink-0">
            <ExportControls 
              diagramSvg={currentSvg}
              diagramCode={currentDiagramContent}
              fileName={`diagram-${currentDiagramId || 'new'}`}
            />
          </div>
        </div>

        {/* Mobile Properties Modal Trigger */}
        <div className="fixed bottom-4 right-4 lg:hidden">
          <Button
            size="sm"
            className="rounded-full w-12 h-12 shadow-lg"
            onClick={() => {
              // This would open a modal/sheet with properties on mobile
              console.log('Open mobile properties panel');
            }}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
