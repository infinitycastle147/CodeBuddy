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

function Toolbar() {
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
                onPressedChange={() => setActiveTool(tool.id)}
                className="h-9 w-9 p-0"
                title={`${tool.name} (${tool.shortcut})`}
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
              onPressedChange={setShowGrid}
              className="h-9 w-9 p-0"
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </Toggle>
            <Button variant="outline" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[120px]">
              <Slider
                value={zoom}
                onValueChange={setZoom}
                max={200}
                min={25}
                step={25}
                className="flex-1"
              />
              <span className="text-xs font-medium w-10">{zoom[0]}%</span>
            </div>
            <Button variant="outline" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
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