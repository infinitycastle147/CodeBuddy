"use client";

import type React from "react";
import {
  BarChart,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DiagramTypeSelector from "./diagram-type-selector";
import Toolbar from "./toolbar";
import ExportControls from "./export-controls";
import PropertiesPanel from "./properties-panel";
import DiagramCanvas from "./diagram-canvas";

export default function DiagramStudioPage() {

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
    end`

  const handleSave = async (diagram: string) => {
    // Mock API call to save the diagram to backend
    // Replace this with your actual API call
    try {
      // await fetch('/api/save-diagram', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ diagram }),
      // })

      console.log("Saving diagram to backend:", diagram)
    } catch (error) {
      console.error("Error saving to backend:", error)
      throw error
    }
  }


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
            <Badge variant="secondary">Beta</Badge>
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
            <DiagramCanvas initialDiagram={initialDiagram} onSave={handleSave} />
          </div>

          {/* Properties Panel */}
          <div className="shrink-0">
            <PropertiesPanel />
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
