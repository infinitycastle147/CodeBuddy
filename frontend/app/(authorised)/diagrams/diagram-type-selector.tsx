"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Database,
  Workflow,
  Network,
  GitBranch,
  Sparkles,
  Loader2,
  Code,
  Users,
  Calendar,
  Clock,
  Layers,
  Boxes,
  Cloud,
  PieChart,
  TrendingUp,
  Target,
  Share2,
  Brain,
  FileText,
  Route,
  Activity,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { useDetectDiagramType } from "@/hooks/api-hooks";
import { useToast } from "@/hooks/use-toast";
import { getDiagramQuery } from "@/lib/diagram-queries";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DiagramType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  color: string;
}

const diagramTypes: DiagramType[] = [
  // Process
  {
    id: "flowchart",
    name: "Flowchart",
    icon: <Workflow className="w-5 h-5" />,
    description: "Process modeling and decision flows",
    category: "Process",
    color: "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20",
  },
  {
    id: "user-journey",
    name: "User Journey",
    icon: <Users className="w-5 h-5" />,
    description: "Experience design and satisfaction mapping",
    category: "Process",
    color: "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20",
  },
  {
    id: "gantt",
    name: "Gantt",
    icon: <Calendar className="w-5 h-5" />,
    description: "Project management and timeline planning",
    category: "Process",
    color: "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20",
  },
  {
    id: "timeline",
    name: "Timeline",
    icon: <Clock className="w-5 h-5" />,
    description: "Chronological events and milestones",
    category: "Process",
    color: "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20",
  },
  {
    id: "kanban",
    name: "Kanban",
    icon: <Layers className="w-5 h-5" />,
    description: "Task management and workflow visualization",
    category: "Process",
    color: "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20",
  },
  // Architecture
  {
    id: "sequence",
    name: "Sequence Diagram",
    icon: <ArrowRight className="w-5 h-5" />,
    description: "System interaction patterns",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  {
    id: "class",
    name: "Class Diagram",
    icon: <Code className="w-5 h-5" />,
    description: "Software architecture and object relationships",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  {
    id: "state",
    name: "State Diagram",
    icon: <Activity className="w-5 h-5" />,
    description: "Behavioral state modeling",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  {
    id: "c4",
    name: "C4",
    icon: <Boxes className="w-5 h-5" />,
    description: "Software architecture at different abstraction levels",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  {
    id: "block",
    name: "Block",
    icon: <Network className="w-5 h-5" />,
    description: "Infrastructure layout and component relationships",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  {
    id: "architecture",
    name: "Architecture",
    icon: <Cloud className="w-5 h-5" />,
    description: "Cloud systems and service relationships",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  {
    id: "zenuml",
    name: "ZenUML",
    icon: <Code className="w-5 h-5" />,
    description: "Programming-focused sequence interactions",
    category: "Architecture",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
  },
  // Data
  {
    id: "erd",
    name: "Entity Relationship Diagram",
    icon: <Database className="w-5 h-5" />,
    description: "Database design and data relationships",
    category: "Data",
    color: "bg-green-500/10 border-green-200 hover:bg-green-500/20",
  },
  {
    id: "pie",
    name: "Pie",
    icon: <PieChart className="w-5 h-5" />,
    description: "Proportional data and business intelligence",
    category: "Data",
    color: "bg-green-500/10 border-green-200 hover:bg-green-500/20",
  },
  {
    id: "xy-chart",
    name: "XY Chart",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Numerical trends and comparisons",
    category: "Data",
    color: "bg-green-500/10 border-green-200 hover:bg-green-500/20",
  },
  {
    id: "radar",
    name: "Radar",
    icon: <Target className="w-5 h-5" />,
    description: "Multi-dimensional performance analysis",
    category: "Data",
    color: "bg-green-500/10 border-green-200 hover:bg-green-500/20",
  },
  {
    id: "sankey",
    name: "Sankey",
    icon: <Share2 className="w-5 h-5" />,
    description: "Flow analysis and resource allocation",
    category: "Data",
    color: "bg-green-500/10 border-green-200 hover:bg-green-500/20",
  },
  // Strategy
  {
    id: "quadrant-chart",
    name: "Quadrant Chart",
    icon: <BarChart className="w-5 h-5" />,
    description: "Decision frameworks and prioritization",
    category: "Strategy",
    color: "bg-orange-500/10 border-orange-200 hover:bg-orange-500/20",
  },
  {
    id: "mindmap",
    name: "Mindmap",
    icon: <Brain className="w-5 h-5" />,
    description: "Information organization and brainstorming",
    category: "Strategy",
    color: "bg-orange-500/10 border-orange-200 hover:bg-orange-500/20",
  },
  {
    id: "requirement",
    name: "Requirement Diagram",
    icon: <FileText className="w-5 h-5" />,
    description: "Requirements engineering and traceability",
    category: "Strategy",
    color: "bg-orange-500/10 border-orange-200 hover:bg-orange-500/20",
  },
  // Technical
  {
    id: "gitgraph",
    name: "Gitgraph",
    icon: <GitBranch className="w-5 h-5" />,
    description: "Version control and branching strategies",
    category: "Technical",
    color: "bg-cyan-500/10 border-cyan-200 hover:bg-cyan-500/20",
  },
  {
    id: "packet",
    name: "Packet",
    icon: <Route className="w-5 h-5" />,
    description: "Network protocol visualization",
    category: "Technical",
    color: "bg-cyan-500/10 border-cyan-200 hover:bg-cyan-500/20",
  },
  // Custom
  {
    id: "custom",
    name: "Custom Diagram",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Create a custom diagram with AI assistance",
    category: "Custom",
    color: "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200 hover:from-violet-500/20 hover:to-purple-500/20",
  },
];

const categoryIcons = {
  Process: <Workflow className="w-4 h-4" />,
  Architecture: <Code className="w-4 h-4" />,
  Data: <Database className="w-4 h-4" />,
  Strategy: <Target className="w-4 h-4" />,
  Technical: <Network className="w-4 h-4" />,
  Custom: <Sparkles className="w-4 h-4" />,
};

interface DiagramTypeSelectorProps {
  value?: string;
  onChange?: (type: string) => void;
  onTypeSelect?: (type: string, query: string) => void;
}

function DiagramTypeSelector({ value, onChange, onTypeSelect }: DiagramTypeSelectorProps = {}) {
  const [selectedType, setSelectedType] = useState(value || "flowchart");
  const [customDescription, setCustomDescription] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const detectDiagramTypeMutation = useDetectDiagramType();
  const { toast } = useToast();

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedType(value);
    }
  }, [value]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    if (onChange) {
      onChange(type);
    }
    if (onTypeSelect) {
      const query = getDiagramQuery(type);
      if (query) {
        onTypeSelect(type, query);
      }
    }
  };

  const handleDetectType = () => {
    if (!customDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a description to detect diagram type.",
      });
      return;
    }

    setIsDetecting(true);
    detectDiagramTypeMutation.mutate(
      { user_input: customDescription },
      {
        onSuccess: (data) => {
          setDetectedType(data.recommended_type);
          setConfidence(data.confidence);
          setIsDetecting(false);
          toast({
            title: "Type Detected",
            description: `Recommended: ${data.recommended_type} (${Math.round(
              data.confidence * 100
            )}% confidence)`,
          });
        },
        onError: () => {
          setIsDetecting(false);
        },
      }
    );
  };


  // Extract unique categories from diagram types
  const categories = Array.from(
    new Set(diagramTypes.map((type) => type.category))
  );

  // const selectedDiagram = diagramTypes.find((type) => type.id === selectedType);

  return (
    <TooltipProvider>
      <Card className="w-full mx-auto border-0 bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-6">
        <Tabs defaultValue={categories[0]}>
          <TabsList className="w-full bg-slate-100 dark:bg-slate-800 p-1 rounded-full shadow-inner">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex items-center justify-center gap-3 p-2 text-sm font-medium rounded-full"
              >
                {categoryIcons[category as keyof typeof categoryIcons]}
                <span className="hidden sm:inline">{category}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {diagramTypes
                .filter((type) => type.category === category)
                .map((type) => (
                  <Tooltip key={type.id}>
                    <TooltipTrigger asChild>
                      <Card
                        className={`h-full border-2 transition-all duration-300 cursor-pointer ${
                          selectedType === type.id
                            ? "border-blue-500 shadow-lg bg-blue-50"
                            : `${type.color} hover:shadow-md`
                        }`}
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full">
                          <div
                            className={`p-3 rounded-full transition-all duration-300 ${
                              selectedType === type.id
                                ? "bg-blue-500 text-white"
                                : "bg-white shadow-sm group-hover:shadow-md"
                            }`}
                          >
                            {type.icon}
                          </div>
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-sm">
                                {type.name}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground leading-relaxed">
                              {type.description}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">{type.name}</p>
                      <p className="text-xs opacity-90 mb-2">{type.description}</p>
                      {getDiagramQuery(type.id) && (
                        <p className="text-xs opacity-75 italic">
                          Click to use predefined query for this diagram type
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Custom Description Input */}
        {selectedType === "custom" && (
          <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
            <Label
              htmlFor="custom-description"
              className="text-sm font-semibold text-violet-900 mb-2 block"
            >
              Describe your custom diagram
            </Label>
            <Textarea
              id="custom-description"
              placeholder="Describe what kind of diagram you want to create. Be as specific as possible..."
              value={customDescription}
              onChange={(e) => {
                setCustomDescription(e.target.value);
                setDetectedType(null);
                setConfidence(null);
              }}
              className="min-h-[100px] border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white/80 backdrop-blur-sm"
            />
            <div className="flex items-center gap-2 mt-3">
              <Button
                onClick={handleDetectType}
                disabled={isDetecting || !customDescription.trim()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isDetecting ? "Detecting..." : "Detect Type"}
              </Button>
              {detectedType && confidence && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {detectedType} ({Math.round(confidence * 100)}%)
                </Badge>
              )}
            </div>
            <p className="text-xs text-violet-600 mt-2">
              💡 Tip: Include details about the structure, elements, and purpose
              of your diagram for best results.
            </p>
          </div>
        )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export default DiagramTypeSelector;
