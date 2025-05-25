"use client";
import React from "react";
import { GitCommit, ListTree, FileDiff, Ticket } from "lucide-react";

function CommitTimeline() {
  return (
    <section className="flex-1 bg-muted rounded-lg flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 font-semibold"><GitCommit /> Commits & PRs</div>
      <div className="text-muted-foreground">Timeline of commits and PRs will appear here.</div>
    </section>
  );
}

function ImpactAreaHighlighter() {
  return (
    <section className="flex-1 bg-muted rounded-lg flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 font-semibold"><ListTree /> Impact Areas</div>
      <div className="text-muted-foreground">Highlighted impact areas will appear here.</div>
    </section>
  );
}

function VisualDiffSummary() {
  return (
    <section className="flex-1 bg-muted rounded-lg flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 font-semibold"><FileDiff /> Visual Diff Summary</div>
      <div className="text-muted-foreground">Visual diff summaries will appear here.</div>
    </section>
  );
}

function RelatedTicketsPanel() {
  return (
    <section className="flex-1 bg-muted rounded-lg flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 font-semibold"><Ticket /> Related Tickets</div>
      <div className="text-muted-foreground">Related stories and tickets will appear here.</div>
    </section>
  );
}

export default function TimelinePage() {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      <div className="flex items-center h-16 px-6 border-b border-border font-bold text-2xl">Change Tracker / Timeline</div>
      <div className="flex-1 flex flex-col gap-6 p-6">
        <CommitTimeline />
        <ImpactAreaHighlighter />
        <VisualDiffSummary />
        <RelatedTicketsPanel />
      </div>
    </div>
  );
} 