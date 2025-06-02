"use client"

import type React from "react"
import { useState } from "react"
import {
  Network,
  Database,
  FileDown,
  BarChart,
  GitBranch,
  Workflow,
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
  Settings,
  Layers,
  Grid,
  Eye,
  Download,
  Upload,
  Copy,
  Trash2,
  Move,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Toggle } from "@/components/ui/toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface DiagramType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  category: string
}

const diagramTypes: DiagramType[] = [
  {
    id: "uml",
    name: "UML Diagram",
    icon: <BarChart className="w-4 h-4" />,
    description: "Unified Modeling Language diagrams",
    category: "Software",
  },
  {
    id: "erd",
    name: "ERD",
    icon: <Database className="w-4 h-4" />,
    description: "Entity Relationship Diagrams",
    category: "Database",
  },
  {
    id: "flowchart",
    name: "Flowchart",
    icon: <Workflow className="w-4 h-4" />,
    description: "Process flow diagrams",
    category: "Process",
  },
  {
    id: "network",
    name: "Network",
    icon: <Network className="w-4 h-4" />,
    description: "Network topology diagrams",
    category: "Infrastructure",
  },
  {
    id: "sequence",
    name: "Sequence",
    icon: <ArrowRight className="w-4 h-4" />,
    description: "Sequence diagrams",
    category: "Software",
  },
  {
    id: "mindmap",
    name: "Mind Map",
    icon: <GitBranch className="w-4 h-4" />,
    description: "Mind mapping diagrams",
    category: "Planning",
  },
]

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  shortcut?: string
}

const tools: Tool[] = [
  { id: "select", name: "Select", icon: <MousePointer className="w-4 h-4" />, shortcut: "V" },
  { id: "rectangle", name: "Rectangle", icon: <Square className="w-4 h-4" />, shortcut: "R" },
  { id: "circle", name: "Circle", icon: <Circle className="w-4 h-4" />, shortcut: "C" },
  { id: "arrow", name: "Arrow", icon: <ArrowRight className="w-4 h-4" />, shortcut: "A" },
  { id: "text", name: "Text", icon: <Type className="w-4 h-4" />, shortcut: "T" },
  { id: "shape", name: "Shapes", icon: <Shapes className="w-4 h-4" />, shortcut: "S" },
]

function DiagramTypeSelector() {
  const [selectedType, setSelectedType] = useState("uml")

  const categories = Array.from(new Set(diagramTypes.map((type) => type.category)))

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Diagram Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {diagramTypes
                  .filter((type) => type.category === category)
                  .map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col items-center gap-2 text-center"
                      onClick={() => setSelectedType(type.id)}
                    >
                      {type.icon}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">{type.name}</span>
                        <span className="text-xs text-muted-foreground hidden lg:block">{type.description}</span>
                      </div>
                    </Button>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function Toolbar() {
  const [activeTool, setActiveTool] = useState("select")
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState([100])

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
            <Toggle pressed={showGrid} onPressedChange={setShowGrid} className="h-9 w-9 p-0" title="Toggle Grid">
              <Grid className="w-4 h-4" />
            </Toggle>
            <Button variant="outline" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[120px]">
              <Slider value={zoom} onValueChange={setZoom} max={200} min={25} step={25} className="flex-1" />
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
  )
}

function DiagramCanvas() {
    return (
      <Card className="flex-1 shadow-sm rounded-xl">
        <CardContent className="p-0 h-full">
          <div className="relative h-full min-h-[500px] bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden">
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
  
            {/* Canvas Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center space-y-6 z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-semibold">Start Creating</h3>
                <p className="text-muted-foreground">
                  Select a diagram type and start building your visual representation. Use the toolbar to add shapes,
                  text, and connections.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Shape
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
            </div>
  
            {/* Canvas Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <Button variant="secondary" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm">
                <Layers className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  

function PropertiesPanel() {
  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Element Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Element</Label>
          <Select defaultValue="none">
            <SelectTrigger>
              <SelectValue placeholder="Select element" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No selection</SelectItem>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="arrow">Arrow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Style Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Style</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs">Fill Color</Label>
              <div className="w-full h-8 bg-primary rounded border cursor-pointer"></div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Border Color</Label>
              <div className="w-full h-8 bg-border rounded border cursor-pointer"></div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Border Width</Label>
            <Slider defaultValue={[2]} max={10} min={0} step={1} />
          </div>
        </div>

        {/* Text Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Text</Label>
          <Input placeholder="Enter text..." />
          <div className="grid grid-cols-2 gap-2">
            <Select defaultValue="16">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="normal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Position Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">X</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Y</Label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input type="number" placeholder="100" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input type="number" placeholder="100" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Move className="w-4 h-4 mr-2" />
            Bring to Front
          </Button>
          <Button variant="destructive" className="w-full justify-start" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ExportControls() {
  const exportFormats = [
    { id: "png", name: "PNG", icon: <FileDown className="w-4 h-4" /> },
    { id: "svg", name: "SVG", icon: <FileDown className="w-4 h-4" /> },
    { id: "pdf", name: "PDF", icon: <FileDown className="w-4 h-4" /> },
    { id: "json", name: "JSON", icon: <FileDown className="w-4 h-4" /> },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {exportFormats.map((format) => (
            <Button key={format.id} variant="outline" className="h-auto p-3 flex flex-col items-center gap-2">
              {format.icon}
              <span className="text-xs font-medium">{format.name}</span>
            </Button>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Quality</Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Scale</Label>
              <Select defaultValue="1x">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1x">1x</SelectItem>
                  <SelectItem value="2x">2x</SelectItem>
                  <SelectItem value="3x">3x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Diagram
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DiagramStudioPage() {
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
                <h1 className="text-xl font-bold leading-tight">Diagram Studio</h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  Professional diagram editor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary">Beta</Badge>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
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
              <DiagramCanvas />
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
    )
  }