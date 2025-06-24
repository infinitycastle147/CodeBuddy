"use client"

import type React from "react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Shapes,
  MousePointer,
  Square,
  Circle,
  ArrowRight,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Share,
  Grid,
  Download,
  Upload,
  Copy,
  Loader2,
  Wand2,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  shortcut?: string
  color?: string
}

interface ToolbarProps {
  onToolChange?: (tool: string) => void
  onZoomChange?: (zoom: number) => void
  onGridToggle?: (show: boolean) => void
  onUndo?: () => void
  onSave?: () => void
  onShare?: () => void
  onGenerate?: () => void
  disabled?: boolean
  loading?: boolean
}

const tools: Tool[] = [
  {
    id: "select",
    name: "Select",
    icon: <MousePointer className="w-4 h-4" />,
    shortcut: "V",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "rectangle",
    name: "Rectangle",
    icon: <Square className="w-4 h-4" />,
    shortcut: "R",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "circle",
    name: "Circle",
    icon: <Circle className="w-4 h-4" />,
    shortcut: "C",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "arrow",
    name: "Arrow",
    icon: <ArrowRight className="w-4 h-4" />,
    shortcut: "A",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "text",
    name: "Text",
    icon: <Type className="w-4 h-4" />,
    shortcut: "T",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "shape",
    name: "Shapes",
    icon: <Shapes className="w-4 h-4" />,
    shortcut: "S",
    color: "from-indigo-500 to-blue-500",
  },
]

export default function AwesomeToolbar({
  onToolChange,
  onZoomChange,
  onGridToggle,
  onUndo,
  onSave,
  onShare,
  onGenerate,
  disabled = false,
  loading = false,
}: ToolbarProps) {
  const [activeTool, setActiveTool] = useState("select")
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState([100])

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId)
    onToolChange?.(toolId)
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom([newZoom])
    onZoomChange?.(newZoom)
  }

  return (
    <TooltipProvider>
      <Card className="shadow-md border-0 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-6">
            {/* Tools Section */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-lg">
                {tools.map((tool) => {
                  const isActive = activeTool === tool.id
                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <div className="relative group">
                          {isActive && (
                            <div
                              className={cn(
                                "absolute -inset-0.5 bg-gradient-to-r rounded-lg blur-sm opacity-60",
                                tool.color,
                              )}
                            />
                          )}
                          <Toggle
                            pressed={isActive}
                            onPressedChange={() => handleToolChange(tool.id)}
                            className={cn(
                              "relative h-9 w-9 p-0 transition-all duration-150 ease-out",
                              "hover:scale-[1.02] hover:shadow-md",
                              isActive ? "bg-white shadow-lg border-2 border-white" : "hover:bg-white/80",
                            )}
                            disabled={disabled}
                          >
                            {tool.icon}
                          </Toggle>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{tool.name}</span>
                          <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200 border-gray-600">
                            {tool.shortcut}
                          </Badge>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
            />

            {/* View Controls Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      {showGrid && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg blur-sm opacity-60" />
                      )}
                      <Toggle
                        pressed={showGrid}
                        onPressedChange={(pressed) => {
                          setShowGrid(pressed)
                          onGridToggle?.(pressed)
                        }}
                        className={cn(
                          "relative h-9 w-9 p-0 transition-all duration-150 ease-out",
                          "hover:scale-[1.02] hover:shadow-md",
                          showGrid ? "bg-white shadow-lg border-2 border-white text-teal-600" : "hover:bg-white/80",
                        )}
                        disabled={disabled}
                      >
                        <Grid className="w-4 h-4" />
                      </Toggle>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                    <span>Toggle Grid</span>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-100/50 rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoomChange(Math.max(25, zoom[0] - 25))}
                      disabled={disabled || zoom[0] <= 25}
                      className="h-8 w-8 p-0 hover:bg-white hover:shadow-md transition-all duration-150 ease-out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                    <span>Zoom Out</span>
                  </TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-3 min-w-[140px] px-2">
                  <Slider
                    value={zoom}
                    onValueChange={(value) => handleZoomChange(value[0])}
                    max={200}
                    min={25}
                    step={25}
                    className="flex-1"
                    disabled={disabled}
                  />
                  <Badge
                    variant="secondary"
                    className="text-xs font-mono min-w-[45px] justify-center bg-white border-gray-200"
                  >
                    {zoom[0]}%
                  </Badge>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoomChange(Math.min(200, zoom[0] + 25))}
                      disabled={disabled || zoom[0] >= 200}
                      className="h-8 w-8 p-0 hover:bg-white hover:shadow-md transition-all duration-150 ease-out"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                    <span>Zoom In</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
            />

            {/* Actions Section */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onUndo}
                      disabled={disabled}
                      className="h-9 px-3 hover:bg-white hover:shadow-md transition-all duration-150 ease-out hover:scale-[1.02]"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Undo
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                    <div className="flex items-center gap-2">
                      <span>Undo</span>
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200 border-gray-600">
                        Ctrl+Z
                      </Badge>
                    </div>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onSave}
                      disabled={disabled}
                      className="h-9 px-3 hover:bg-white hover:shadow-md transition-all duration-150 ease-out hover:scale-[1.02] text-blue-600 hover:text-blue-700"
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                    <div className="flex items-center gap-2">
                      <span>Save</span>
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200 border-gray-600">
                        Ctrl+S
                      </Badge>
                    </div>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={disabled}
                          className="h-9 px-3 hover:bg-white hover:shadow-md transition-all duration-150 ease-out hover:scale-[1.02] text-purple-600 hover:text-purple-700"
                        >
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                        <span>Share Options</span>
                      </TooltipContent>
                    </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                      className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer"
                    >
                      <Copy className="w-4 h-4 mr-2 text-blue-600" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onShare} className="hover:bg-green-50 focus:bg-green-50 cursor-pointer">
                      <Download className="w-4 h-4 mr-2 text-green-600" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2 text-purple-600" />
                      <span>Upload File</span>
                      <input
                        title="Upload Mermaid File"
                        placeholder="Choose a .mmd or .txt file"
                        id="file-upload"
                        type="file"
                        accept=".mmd,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              console.log("File content:", event.target?.result)
                            }
                            reader.readAsText(file)
                          }
                        }}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Generate Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-150" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onGenerate}
                        disabled={disabled}
                        className="relative h-9 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg transition-all duration-150 ease-out hover:scale-[1.02] border-0"
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black text-white border-gray-800 font-medium">
                    <div className="flex items-center gap-2">
                      <span>AI Generate</span>
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200 border-gray-600">
                        Ctrl+G
                      </Badge>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
