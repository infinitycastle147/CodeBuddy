"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wand2, Sparkles } from "lucide-react";
import { useDetectDiagramType, useGenerateDiagramFromText } from "@/hooks/api-hooks";
import { useToast } from "@/hooks/use-toast";
import { getDiagramDisplayName, DiagramType } from "@/lib/diagram-icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DiagramCanvas from "@/app/(authorised)/diagrams/diagram-canvas";

// Map backend values to frontend values
const diagramTypeMapping: Record<string, string> = {
  "flowchart": "flowchart",
  "user_journey": "user-journey",
  "gantt": "gantt",
  "timeline": "timeline",
  "kanban": "kanban",
  "sequence": "sequence",
  "class": "class",
  "state": "state",
  "c4": "c4",
  "block": "block",
  "architecture": "architecture",
  "zenuml": "zenuml",
  "erd": "erd",
  "pie": "pie",
  "xy_chart": "xy-chart",
  "radar": "radar",
  "sankey": "sankey",
  "quadrant_chart": "quadrant-chart",
  "mindmap": "mindmap",
  "requirement": "requirement",
  "gitgraph": "gitgraph",
  "packet": "packet",
};

const diagramTypes: DiagramType[] = [
  "flowchart",
  "user-journey",
  "gantt",
  "timeline",
  "kanban",
  "sequence",
  "class",
  "state",
  "c4",
  "block",
  "architecture",
  "zenuml",
  "erd",
  "pie",
  "xy-chart",
  "radar",
  "sankey",
  "quadrant-chart",
  "mindmap",
  "requirement",
  "gitgraph",
  "packet",
];

export default function TextToDiagramPage() {
  const [rawText, setRawText] = useState("");
  const [query, setQuery] = useState("");
  const [selectedDiagramType, setSelectedDiagramType] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedType, setDetectedType] = useState<string>("");
  const [generatedDiagram, setGeneratedDiagram] = useState<string>("");

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log("Selected diagram type changed to:", selectedDiagramType);
  }, [selectedDiagramType]);

  const { toast } = useToast();
  const detectDiagramType = useDetectDiagramType();
  const generateDiagramFromText = useGenerateDiagramFromText();

  const handleDetectType = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a query to detect diagram type",
      });
      return;
    }

    setIsDetecting(true);
    try {
      const result = await detectDiagramType.mutateAsync({
        user_input: query,
      });

      console.log("Detection result:", result);
      if (result.diagram_type) {
        // Map backend value to frontend value
        const mappedType = diagramTypeMapping[result.diagram_type];
        console.log("Backend type:", result.diagram_type, "-> Frontend type:", mappedType);

        if (mappedType) {
          setDetectedType(mappedType);
          setSelectedDiagramType(mappedType);
          toast({
            title: "Diagram Type Detected",
            description: `Recommended: ${getDiagramDisplayName(mappedType)})`,
          });
        } else {
          console.error("Unknown diagram type from backend:", result.diagram_type);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Received unknown diagram type from server",
          });
        }
      }
    } catch (error) {
      console.error("Failed to detect diagram type:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleGenerateDiagram = async () => {
    if (!rawText.trim() || !query.trim() || !selectedDiagramType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields and select a diagram type",
      });
      return;
    }

    // Convert frontend type back to backend format
    const backendType = Object.entries(diagramTypeMapping).find(
      ([, frontendVal]) => frontendVal === selectedDiagramType
    )?.[0] || selectedDiagramType;

    generateDiagramFromText.mutate(
      {
        query: query,
        text: rawText,
        diagram_type: backendType,
      },
      {
        onSuccess: (response) => {
          console.log("Generated diagram response:", response);
          if (response?.diagram) {
            setGeneratedDiagram(response.diagram);
            toast({
              title: "Success",
              description: "Diagram generated successfully!",
            });
          }
        },
        onError: (error) => {
          console.error("Failed to generate diagram:", error);
        }
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Text to Diagram
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Generate diagrams from text content
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Input Section */}
          <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="raw-text">Raw Text</Label>
              <Textarea
                id="raw-text"
                placeholder="Paste your text content here..."
                className="min-h-[200px] mt-2"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                placeholder="Describe what diagram you want to create from this text..."
                className="min-h-[100px] mt-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <Button
                  onClick={handleDetectType}
                  disabled={isDetecting || !query.trim()}
                  variant="outline"
                  className="min-w-[150px]"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Detect Type
                    </>
                  )}
                </Button>
                {detectedType && (
                  <p className="text-sm text-muted-foreground">
                    Detected: {getDiagramDisplayName(detectedType)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="diagram-type">Diagram Type</Label>
                <Select
                  value={selectedDiagramType}
                  onValueChange={setSelectedDiagramType}
                >
                  <SelectTrigger id="diagram-type" className="mt-2">
                    <SelectValue placeholder="Select a diagram type" />
                  </SelectTrigger>
                  <SelectContent>
                    {diagramTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getDiagramDisplayName(type)}
                        {detectedType === type && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Recommended)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedDiagramType && (
              <Button
                onClick={handleGenerateDiagram}
                disabled={generateDiagramFromText.isPending || !rawText.trim() || !query.trim()}
                className="w-full"
              >
                {generateDiagramFromText.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Diagram...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Diagram
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Diagram Editor Section */}
        <Card className="p-6 min-h-[600px]">
          <div className="h-full">
            <h3 className="text-lg font-semibold mb-4">Generated Diagram</h3>
            {generatedDiagram ? (
              <div className="h-full">
                <DiagramCanvas
                  diagram={generatedDiagram}
                  onChange={setGeneratedDiagram}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">No diagram generated yet</p>
                  <p className="text-sm">Fill in the fields and click &quot;Generate Diagram&quot; to see the result here</p>
                </div>
              </div>
            )}
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}