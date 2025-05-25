"use client";
import React from "react";
import { UserCog, Palette, GitBranch, Ticket, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function SettingsTab({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">{icon}{label}</div>
  );
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-2">
      <button className="flex items-center gap-2 w-full text-left font-medium" onClick={() => setOpen((v) => !v)}>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
        {title}
      </button>
      {open && <div className="pl-6 pt-2">{children}</div>}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      <div className="flex items-center h-16 px-6 border-b border-border font-bold text-2xl">Settings & Preferences</div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <section className="flex flex-col gap-6">
            <SettingsTab icon={<UserCog />} label="Role Customization" />
            <CollapsibleSection title="Switch Role">
              {/* Placeholder for role switcher */}
              <Button variant="outline">Change Role</Button>
            </CollapsibleSection>
            <CollapsibleSection title="Theme per Role">
              {/* Placeholder for theme toggles */}
              <Button variant="outline"><Palette className="mr-2" /> Change Theme</Button>
            </CollapsibleSection>
          </section>
          <section className="flex flex-col gap-6">
            <SettingsTab icon={<GitBranch />} label="Git/Jira Integration" />
            <CollapsibleSection title="Configure Integrations">
              {/* Placeholder for integration config */}
              <Button variant="outline"><GitBranch className="mr-2" /> Connect Git</Button>
              <Button variant="outline"><Ticket className="mr-2" /> Connect Jira</Button>
            </CollapsibleSection>
            <SettingsTab icon={<Download />} label="Export & Feedback" />
            <CollapsibleSection title="Feedback Opt-in">
              {/* Placeholder for feedback toggle */}
              <Button variant="outline">Opt-in for Feedback</Button>
            </CollapsibleSection>
            <CollapsibleSection title="Export Options">
              {/* Placeholder for export options */}
              <Button variant="outline"><Download className="mr-2" /> Export Data</Button>
            </CollapsibleSection>
          </section>
        </div>
      </div>
    </div>
  );
} 