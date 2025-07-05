"use client";

// External dependencies
import type React from "react";
import { useState } from "react";
import { BarChart, Save, Plus, List, FileText, Wand2, Clock, FolderOpen, ChevronDown } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Custom hooks
import {
  useDiagrams,
  useCreateDiagram,
  useUpdateDiagram,
  useDetectDiagramType,
} from "@/hooks/api-hooks";

// Local components
import DiagramTypeSelector from "@/app/(authorised)/diagrams/diagram-type-selector";
// import Toolbar from "@/app/(authorised)/diagrams/toolbar"; // Commented out - tools not implemented for Mermaid
import ExportControls from "@/app/(authorised)/diagrams/export-controls";
import DiagramCanvas from "@/app/(authorised)/diagrams/diagram-canvas";
import { getDiagramQuery } from "@/lib/diagram-queries";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { getTypeIcon } from "@/lib/diagram-icons";

export default function DiagramStudioPage() {
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentDiagramContent, setCurrentDiagramContent] =
    useState<string>("");
  const [isNewDiagram, setIsNewDiagram] = useState(true);
  const [selectedDiagramType, setSelectedDiagramType] = useState("flowchart");

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

  const handleLoadDiagram = (diagram: {
    id: string;
    content?: string;
    title?: string;
    description?: string;
  }) => {
    setCurrentDiagramId(diagram.id);
    setCurrentDiagramContent(diagram.content || "");
    setIsNewDiagram(false);
  };

  const handleCreateDiagram = async () => {
    // Generate button mode - use predefined query
    const predefinedQuery = getDiagramQuery(selectedDiagramType);
    if (!predefinedQuery) {
      console.error(
        "No predefined query found for diagram type:",
        selectedDiagramType
      );
      return;
    }

    try {
      const newDiagram = await createDiagramMutation.mutateAsync({
        user_input: predefinedQuery,
        title: `${
          selectedDiagramType.charAt(0).toUpperCase() +
          selectedDiagramType.slice(1)
        } Diagram`,
        description: `Auto-generated ${selectedDiagramType} diagram`,
        type: selectedDiagramType,
      });

      setCurrentDiagramId(newDiagram.id);
      setCurrentDiagramContent(newDiagram.content || "");
      setIsNewDiagram(false);
    } catch (error) {
      console.error("Failed to create diagram:", error);
    }
  };

  const handleDiagramTypeSelect = (type: string, query: string) => {
    setSelectedDiagramType(type);
  };

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
          {/* Diagrams Count Badge */}
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium"
          >
            <FileText className="w-3 h-3 mr-1.5" />
            {diagrams?.length || 0} diagrams
          </Badge>

          {/* Load Diagrams Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-2 h-9 px-3",
                  "border-slate-200 hover:border-slate-300",
                  "hover:bg-slate-50 transition-all duration-200",
                  "shadow-sm hover:shadow-md"
                )}
              >
                <FolderOpen className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline font-medium">Load</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-2 shadow-lg border-slate-200"
              sideOffset={8}
            >
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Recent Diagrams
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />

              {diagrams && diagrams.length > 0 ? (
                <div className="space-y-1">
                  {diagrams.map((diagram) => (
                    <DropdownMenuItem
                      key={diagram.id}
                      onClick={() => handleLoadDiagram(diagram)}
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer rounded-md",
                        "hover:bg-slate-50 transition-colors duration-150",
                        "focus:bg-slate-50 focus:outline-none"
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                          {getTypeIcon(diagram.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {diagram.title || "Untitled Diagram"}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0.5 capitalize"
                          >
                            {diagram.type}
                          </Badge>
                        </div>

                        {diagram.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {diagram.description}
                          </p>
                        )}

                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(diagram.created_at, 'PPP')}</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    No diagrams found
                  </p>
                  <p className="text-xs text-slate-400 text-center">
                    Create your first diagram to get started
                  </p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Diagram Button */}
          <Button
            onClick={handleNewDiagram}
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 h-9 px-3",
              "border-slate-200 hover:border-blue-300",
              "hover:bg-blue-50 transition-all duration-200",
              "shadow-sm hover:shadow-md"
            )}
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline font-medium">New</span>
          </Button>

          {/* Save Button */}
          <Button
            onClick={() => handleSave(currentDiagramContent)}
            disabled={isSaving}
            size="sm"
            className={cn(
              "flex items-center gap-2 h-9 px-3",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "shadow-sm hover:shadow-md transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4 p-6 min-h-0 overflow-hidden">
        {/* Top Controls */}
        <div className="shrink-0 space-y-4">
          {/* Generate Controls */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-900">
                  AI Diagram Generator
                </h3>
                <p className="text-xs text-emerald-700">
                  {selectedDiagramType.charAt(0).toUpperCase() +
                    selectedDiagramType.slice(1)}{" "}
                  diagram will be generated based on your description
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateDiagram}
              disabled={createDiagramMutation.isPending}
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg"
            >
              {createDiagramMutation.isPending ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate{" "}
                  {selectedDiagramType.charAt(0).toUpperCase() +
                    selectedDiagramType.slice(1)}
                </>
              )}
            </Button>
          </div>

          <DiagramTypeSelector onTypeSelect={handleDiagramTypeSelect} />

          {/* Toolbar - Commented out since shape tools don't work with text-based Mermaid */}
          {/* 
          <Toolbar
            onToolChange={(tool) => console.log("Tool changed:", tool)}
            onGridToggle={(show) => console.log("Grid toggled:", show)}
            onUndo={() => console.log("Undo action")}
            onSave={() => handleSave(currentDiagramContent)}
            onShare={() => console.log("Share action")}
            onGenerate={handleToolbarGenerate}
            disabled={isSaving}
            loading={createDiagramMutation.isPending}
          />
          */}
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
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0">
          <ExportControls />
        </div>
      </main>
    </div>
  );
}
