"use client";

import { Button } from "@/components/ui/button";
import { Eye, Code, Save, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactCanvasControlsProps {
  isEditMode: boolean;
  loading: boolean;
  onToggleMode: () => void;
  onSave: () => void;
  onExport: () => void;
  className?: string;
}

export default function CompactCanvasControls({
  isEditMode,
  loading,
  onToggleMode,
  onSave,
  onExport,
  className,
}: CompactCanvasControlsProps) {
  return (
    <div className={cn("absolute bottom-4 right-4 flex gap-2 z-20", className)}>
      {/* Mode Toggle Button */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-55 transition duration-300" />
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleMode}
          disabled={loading}
          className={cn(
            "relative bg-white/90 backdrop-blur-sm border-0 shadow-lg transition-all duration-300",
            "hover:shadow-xl hover:scale-105 hover:-translate-y-0.5",
            "group-hover:bg-white",
            isEditMode
              ? "text-emerald-600 hover:text-emerald-700"
              : "text-amber-600 hover:text-amber-700"
          )}
          title={isEditMode ? "Preview Mode" : "Edit Mode"}
        >
          <div className="relative">
            {isEditMode ? (
              <Eye className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            ) : (
              <Code className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            )}
            {/* Status dot */}
            <div
              className={cn(
                "absolute -top-1 -right-1 w-2 h-2 rounded-full transition-colors duration-300",
                isEditMode ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              )}
            />
          </div>
        </Button>
      </div>

      {/* Save Button */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-55 transition duration-300" />
        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          disabled={loading}
          className={cn(
            "relative bg-white/90 backdrop-blur-sm border-0 shadow-lg transition-all duration-300",
            "hover:shadow-xl hover:scale-105 hover:-translate-y-0.5",
            "group-hover:bg-white text-blue-600 hover:text-blue-700"
          )}
          title="Save Diagram"
        >
          <div className="relative">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Export Button */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-55 transition duration-300" />
        <Button
          variant="secondary"
          size="sm"
          onClick={onExport}
          disabled={loading}
          className={cn(
            "relative bg-white/90 backdrop-blur-sm border-0 shadow-lg transition-all duration-300",
            "hover:shadow-xl hover:scale-105 hover:-translate-y-0.5",
            "group-hover:bg-white text-violet-600 hover:text-violet-700"
          )}
          title="Export Diagram"
        >
          <div className="relative">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded bg-violet-500/20 animate-ping opacity-0 group-hover:opacity-100" />
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
