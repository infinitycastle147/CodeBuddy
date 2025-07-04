"use client";

// External dependencies
import type React from "react";
import { useState } from "react";
import { BarChart, Settings, Save, Plus, List, FileText } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import Toolbar from "@/app/(authorised)/diagrams/toolbar";
import ExportControls from "@/app/(authorised)/diagrams/export-controls";
import DiagramCanvas from "@/app/(authorised)/diagrams/diagram-canvas";

export default function DiagramStudioPage() {
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [currentDiagramContent, setCurrentDiagramContent] =
    useState<string>("");
  const [isNewDiagram, setIsNewDiagram] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    userInput: "",
    type: "flowchart",
  });
  const [selectedDiagramType, setSelectedDiagramType] = useState("flowchart");

  // React Query hooks
  const { data: diagrams } = useDiagrams();
  const createDiagramMutation = useCreateDiagram();
  const updateDiagramMutation = useUpdateDiagram();
  const detectDiagramTypeMutation = useDetectDiagramType();

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

  const handleLoadDiagram = (diagram: any) => {
    setCurrentDiagramId(diagram.id);
    setCurrentDiagramContent(diagram.content || "");
    setIsNewDiagram(false);
  };

  const handleCreateWithAI = () => {
    setShowCreateDialog(true);
  };

  const handleAIRecommendation = async () => {
    if (!createForm.userInput.trim()) return;
    
    try {
      const result = await detectDiagramTypeMutation.mutateAsync({
        user_input: createForm.userInput,
      });
      
      const recommendedType = result.recommended_type || "flowchart";
      setCreateForm(prev => ({
        ...prev,
        type: recommendedType,
      }));
      setSelectedDiagramType(recommendedType);
    } catch (error) {
      console.error("Failed to get AI recommendation:", error);
    }
  };

  const handleCreateDiagram = async () => {
    if (!createForm.userInput.trim()) return;

    try {
      const newDiagram = await createDiagramMutation.mutateAsync({
        user_input: createForm.userInput,
        title: createForm.title || undefined,
        description: createForm.description || undefined,
        type: createForm.type,
      });

      setCurrentDiagramId(newDiagram.id);
      setCurrentDiagramContent(newDiagram.content || "");
      setIsNewDiagram(false);
      setShowCreateDialog(false);
      setCreateForm({
        title: "",
        description: "",
        userInput: "",
        type: "flowchart",
      });
    } catch (error) {
      console.error("Failed to create diagram:", error);
    }
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
          <Badge variant="secondary">{diagrams?.length || 0} diagrams</Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Load</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {diagrams && diagrams.length > 0 ? (
                <>
                  {diagrams.map((diagram) => (
                    <DropdownMenuItem
                      key={diagram.id}
                      onClick={() => handleLoadDiagram(diagram)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {diagram.title || "Untitled Diagram"}
                        </p>
                        {diagram.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {diagram.description}
                          </p>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                <DropdownMenuItem disabled>
                  <span className="text-sm text-muted-foreground">No diagrams found</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleNewDiagram}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <BarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Generate with AI</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Generate Diagram with AI</DialogTitle>
                <DialogDescription>
                  Describe what you want to visualize and AI will create the perfect diagram for you.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user-input">Describe your diagram *</Label>
                  <Textarea
                    id="user-input"
                    placeholder="e.g., Show the user registration process with email verification..."
                    value={createForm.userInput}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, userInput: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="My Diagram"
                    value={createForm.title}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the diagram"
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Diagram Type</Label>
                    <Button
                      type="button"
                      variant={createForm.type === "custom" ? "default" : "outline"}
                      size="sm"
                      onClick={handleAIRecommendation}
                      disabled={!createForm.userInput.trim() || detectDiagramTypeMutation.isPending}
                      className="text-xs"
                    >
                      {detectDiagramTypeMutation.isPending ? "Analyzing..." : "Ask AI for recommendation"}
                    </Button>
                  </div>
                  <DiagramTypeSelector
                    value={createForm.type}
                    onChange={(type) => setCreateForm(prev => ({ ...prev, type }))}
                  />
                  {createForm.type === "custom" && (
                    <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                      <p className="text-sm text-violet-700 mb-2">
                        💡 <strong>Custom Diagram Selected:</strong> AI will analyze your description and create the most suitable diagram type.
                      </p>
                      <p className="text-xs text-violet-600">
                        Click "Ask AI for recommendation" above to get a specific diagram type suggestion, or proceed with "Custom" to let AI decide automatically.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateDiagram}
                  disabled={!createForm.userInput.trim() || createDiagramMutation.isPending}
                >
                  {createDiagramMutation.isPending ? "Generating..." : "Generate Diagram"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
        </div>

        {/* Bottom Controls */}
        <div className="shrink-0">
          <ExportControls />
        </div>
      </main>
    </div>
  );
}
