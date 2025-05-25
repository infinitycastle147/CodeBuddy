"use client";
import React from "react";
import { Flowchart, Network, Database, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function DiagramTypeSelector() {
  return (
    <div className="flex gap-2">
      <Button variant="outline"><Flowchart className="mr-2" /> UML</Button>
      <Button variant="outline"><Network className="mr-2" /> ERD</Button>
      <Button variant="outline"><Flowchart className="mr-2" /> Flowchart</Button>
    </div>
  );
}

function DiagramCanvas() {
  return (
    <div className="flex-1 bg-muted rounded-lg flex items-center justify-center min-h-[400px]">
      <span className="text-muted-foreground">Diagram will appear here.</span>
    </div>
  );
}

function DiagramExportControls() {
  return (
    <div className="flex gap-2">
      <Button variant="outline"><FileDown className="mr-2" /> Export PNG</Button>
      <Button variant="outline"><FileDown className="mr-2" /> Export SVG</Button>
    </div>
  );
}

export default function DiagramStudioPage() {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      <div className="flex items-center h-16 px-6 border-b border-border font-bold text-2xl">Diagram Studio</div>
      <div className="flex flex-col flex-1 gap-6 p-6">
        <DiagramTypeSelector />
        <DiagramCanvas />
        <DiagramExportControls />
      </div>
    </div>
  );
} 