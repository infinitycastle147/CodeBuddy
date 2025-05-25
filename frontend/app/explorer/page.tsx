"use client";
import React from "react";
import { File, Code, Brain, Search, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function FileTreePanel() {
  return (
    <aside className="w-64 h-full bg-secondary border-r border-border flex flex-col gap-2">
      <div className="flex items-center gap-2 h-16 px-4 font-semibold border-b border-border"><File /> Files</div>
      {/* Placeholder for file tree */}
      <div className="flex-1 flex items-center justify-center text-muted-foreground">File tree will appear here.</div>
    </aside>
  );
}

function CodeViewerPanel() {
  return (
    <section className="flex-1 h-full bg-background flex flex-col border-r border-border">
      <div className="flex items-center gap-2 h-16 px-4 font-semibold border-b border-border"><Code /> Code Viewer</div>
      {/* Placeholder for code viewer */}
      <div className="flex-1 flex items-center justify-center text-muted-foreground">Code content will appear here.</div>
    </section>
  );
}

function AiContextualPanel() {
  return (
    <aside className="w-80 h-full bg-card border-l border-border flex flex-col gap-4">
      <div className="flex items-center gap-2 h-16 px-4 font-semibold border-b border-border"><Brain /> AI Lens</div>
      <div className="flex flex-col gap-2 p-4">
        <Button variant="outline" className="w-full flex items-center gap-2"><Search /> Explain This</Button>
        <Button variant="outline" className="w-full flex items-center gap-2"><Link2 /> How it relates to [X feature]</Button>
      </div>
      <div className="flex-1 flex items-center justify-center text-muted-foreground">AI insights and dependencies will appear here.</div>
    </aside>
  );
}

export default function CodeExplorerPage() {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <FileTreePanel />
      <CodeViewerPanel />
      <AiContextualPanel />
    </div>
  );
} 