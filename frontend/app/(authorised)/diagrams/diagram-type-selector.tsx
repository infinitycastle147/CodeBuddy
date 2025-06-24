"use client";

// React and state management
import type React from "react";
import { useState } from "react";

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Icons
import {
  BarChart,
  Database,
  Workflow,
  Network,
  GitBranch,
  Sparkles,
  Loader2,
  Zap,
  Palette,
  Code,
} from "lucide-react";
import { Settings } from "@/components/animate-ui/icons/settings";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

// Tabs component
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/radix/tabs";

interface DiagramType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  color: string;
  popular?: boolean;
}

const diagramTypes: DiagramType[] = [
  {
    id: "uml",
    name: "UML Diagram",
    icon: <BarChart className="w-5 h-5" />,
    description: "Unified Modeling Language diagrams for software design",
    category: "Software",
    color: "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20",
    popular: true,
  },
  {
    id: "erd",
    name: "ERD",
    icon: <Database className="w-5 h-5" />,
    description: "Entity Relationship Diagrams for database design",
    category: "Database",
    color: "bg-green-500/10 border-green-200 hover:bg-green-500/20",
    popular: true,
  },
  {
    id: "flowchart",
    name: "Flowchart",
    icon: <Workflow className="w-5 h-5" />,
    description: "Process flow diagrams and workflows",
    category: "Process",
    color: "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20",
    popular: true,
  },
  {
    id: "network",
    name: "Network",
    icon: <Network className="w-5 h-5" />,
    description: "Network topology and infrastructure diagrams",
    category: "Infrastructure",
    color: "bg-orange-500/10 border-orange-200 hover:bg-orange-500/20",
  },
  {
    id: "sequence",
    name: "Sequence",
    icon: <ArrowRight className="w-5 h-5" />,
    description: "Sequence diagrams for system interactions",
    category: "Software",
    color: "bg-cyan-500/10 border-cyan-200 hover:bg-cyan-500/20",
  },
  {
    id: "mindmap",
    name: "Mind Map",
    icon: <GitBranch className="w-5 h-5" />,
    description: "Mind mapping for brainstorming and planning",
    category: "Planning",
    color: "bg-pink-500/10 border-pink-200 hover:bg-pink-500/20",
  },
  {
    id: "custom",
    name: "Custom Diagram",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Create a custom diagram with AI assistance",
    category: "Custom",
    color:
      "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200 hover:from-violet-500/20 hover:to-purple-500/20",
  },
];

const categoryIcons = {
  Software: <Code className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Process: <Workflow className="w-4 h-4" />,
  Infrastructure: <Network className="w-4 h-4" />,
  Planning: <GitBranch className="w-4 h-4" />,
  Custom: <Palette className="w-4 h-4" />,
};

function DiagramTypeSelector() {
  const [selectedType, setSelectedType] = useState("uml");
  const [customDescription, setCustomDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (selectedType === "custom" && !customDescription.trim()) {
      alert("Please enter a description for the custom diagram.");
      return;
    }
    setIsGenerating(true);
    // Simulate diagram generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Diagram of type "${selectedType}" generated successfully!`);
    }, 2000);
  };

  // Extract unique categories from diagram types
  const categories = Array.from(
    new Set(diagramTypes.map((type) => type.category))
  );

  const selectedDiagram = diagramTypes.find((type) => type.id === selectedType);

  return (
    <Card className="w-full mx-auto border-0 bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="pb-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
        <CardTitle className="text-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Diagram Generator</h2>
              <p className="text-slate-300 text-sm font-normal mt-1">
                Choose your diagram type and generate instantly
              </p>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={
              isGenerating ||
              (selectedType === "custom" && !customDescription.trim())
            }
            className="h-12 px-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Diagram
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Selected Diagram Preview */}
        {selectedDiagram && (
          <div className="mb-6 p-4 rounded-lg bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {selectedDiagram.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {selectedDiagram.name}
                  {selectedDiagram.popular && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      Popular
                    </Badge>
                  )}
                </h3>
                <p className="text-slate-600 text-sm">
                  {selectedDiagram.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue={categories[0]} className="w-full h-full">
          <TabsList className="grid w-full gap-1 h-full grid-cols-3 lg:grid-cols-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-full shadow-inner">
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
                  <Card
                    className={`h-full border-2 transition-all duration-300 ${
                      selectedType === type.id
                        ? "border-blue-500 shadow-lg bg-blue-50"
                        : `${type.color} hover:shadow-md`
                    }`}
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
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
                          {type.popular && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                            >
                              ⭐
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {type.description}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
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
              onChange={(e) => setCustomDescription(e.target.value)}
              className="min-h-[100px] border-violet-200 focus:border-violet-400 focus:ring-violet-400 bg-white/80 backdrop-blur-sm"
            />
            <p className="text-xs text-violet-600 mt-2">
              💡 Tip: Include details about the structure, elements, and purpose
              of your diagram for best results.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DiagramTypeSelector;
