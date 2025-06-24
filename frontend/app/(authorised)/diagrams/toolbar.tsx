import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortcut?: string;
}

interface ToolbarProps {
  onToolChange?: (tool: string) => void;
  onZoomChange?: (zoom: number) => void;
  onGridToggle?: (show: boolean) => void;
  onUndo?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  disabled?: boolean;
}

const tools: Tool[] = [
  {
    id: "select",
    name: "Select",
    icon: <MousePointer className="w-4 h-4" />,
    shortcut: "V",
  },
  {
    id: "rectangle",
    name: "Rectangle",
    icon: <Square className="w-4 h-4" />,
    shortcut: "R",
  },
  {
    id: "circle",
    name: "Circle",
    icon: <Circle className="w-4 h-4" />,
    shortcut: "C",
  },
  {
    id: "arrow",
    name: "Arrow",
    icon: <ArrowRight className="w-4 h-4" />,
    shortcut: "A",
  },
  {
    id: "text",
    name: "Text",
    icon: <Type className="w-4 h-4" />,
    shortcut: "T",
  },
  {
    id: "shape",
    name: "Shapes",
    icon: <Shapes className="w-4 h-4" />,
    shortcut: "S",
  },
];

function Toolbar({ 
  onToolChange, 
  onZoomChange, 
  onGridToggle, 
  onUndo, 
  onSave, 
  onShare,
  disabled = false 
}: ToolbarProps) {
  const [activeTool, setActiveTool] = useState("select");
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState([100]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Tools */}
          <div className="flex items-center gap-1">
            {tools.map((tool) => (
              <Toggle
                key={tool.id}
                pressed={activeTool === tool.id}
                onPressedChange={() => {
                  setActiveTool(tool.id);
                  onToolChange?.(tool.id);
                }}
                className="h-9 w-9 p-0"
                title={`${tool.name} (${tool.shortcut})`}
                disabled={disabled}
              >
                {tool.icon}
              </Toggle>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <Toggle
              pressed={showGrid}
              onPressedChange={(pressed) => {
                setShowGrid(pressed);
                onGridToggle?.(pressed);
              }}
              className="h-9 w-9 p-0"
              title="Toggle Grid"
              disabled={disabled}
            >
              <Grid className="w-4 h-4" />
            </Toggle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newZoom = Math.max(25, zoom[0] - 25);
                setZoom([newZoom]);
                onZoomChange?.(newZoom);
              }}
              disabled={disabled || zoom[0] <= 25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[120px]">
              <Slider
                value={zoom}
                onValueChange={(value) => {
                  setZoom(value);
                  onZoomChange?.(value[0]);
                }}
                max={200}
                min={25}
                step={25}
                className="flex-1"
                disabled={disabled}
              />
              <span className="text-xs font-medium w-10">{zoom[0]}%</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newZoom = Math.min(200, zoom[0] + 25);
                setZoom([newZoom]);
                onZoomChange?.(newZoom);
              }}
              disabled={disabled || zoom[0] >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onUndo}
              disabled={disabled}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSave}
              disabled={disabled}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled}>
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShare}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                  <input
                    id="file-upload"
                    type="file"
                    accept=".mmd,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          // Handle file upload - would need to be passed from parent
                          console.log('File content:', event.target?.result);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Toolbar;