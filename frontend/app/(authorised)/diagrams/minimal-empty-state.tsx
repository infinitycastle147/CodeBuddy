"use client"

import { Button } from "@/components/ui/button"
import { Code, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface MinimalEmptyStateProps {
  onStartEditing: () => void
  onImport: () => void
  className?: string
}

export default function MinimalEmptyState({ onStartEditing, onImport, className }: MinimalEmptyStateProps) {
  return (
    <div className={cn("text-center space-y-6", className)}>
      {/* Icon */}
      <div className="relative group">
        <div className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center mx-auto transition-all duration-200 group-hover:scale-105">
          <Code className="w-8 h-8 text-gray-600 group-hover:text-gray-700 transition-colors duration-200" />
        </div>
        {/* Subtle pulse ring on hover */}
        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-gray-300 opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
          Start Creating
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Create beautiful diagrams using Mermaid syntax. Switch to edit mode to start coding your diagram.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          size="sm"
          onClick={onStartEditing}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          aria-label="Start Editing"
        >
          <Code className="w-4 h-4" />
          Start Editing
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onImport}
          className="flex items-center gap-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
          aria-label="Import Diagram"
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
      </div>
    </div>
  )
}
