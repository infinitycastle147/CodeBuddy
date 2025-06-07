import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Database, Workflow, Network, ArrowRight, GitBranch } from "lucide-react";

interface DiagramType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}


const diagramTypes: DiagramType[] = [
  {
    id: "uml",
    name: "UML Diagram",
    icon: <BarChart className="w-4 h-4" />,
    description: "Unified Modeling Language diagrams",
    category: "Software",
  },
  {
    id: "erd",
    name: "ERD",
    icon: <Database className="w-4 h-4" />,
    description: "Entity Relationship Diagrams",
    category: "Database",
  },
  {
    id: "flowchart",
    name: "Flowchart",
    icon: <Workflow className="w-4 h-4" />,
    description: "Process flow diagrams",
    category: "Process",
  },
  {
    id: "network",
    name: "Network",
    icon: <Network className="w-4 h-4" />,
    description: "Network topology diagrams",
    category: "Infrastructure",
  },
  {
    id: "sequence",
    name: "Sequence",
    icon: <ArrowRight className="w-4 h-4" />,
    description: "Sequence diagrams",
    category: "Software",
  },
  {
    id: "mindmap",
    name: "Mind Map",
    icon: <GitBranch className="w-4 h-4" />,
    description: "Mind mapping diagrams",
    category: "Planning",
  },
];

function DiagramTypeSelector() {
  const [selectedType, setSelectedType] = useState("uml");

  const categories = Array.from(
    new Set(diagramTypes.map((type) => type.category))
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Diagram Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {diagramTypes
                  .filter((type) => type.category === category)
                  .map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2 text-center"
                      onClick={() => setSelectedType(type.id)}
                    >
                      {type.icon}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">{type.name}</span>
                        <span className="text-xs text-muted-foreground hidden lg:block">
                          {type.description}
                        </span>
                      </div>
                    </Button>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default DiagramTypeSelector