"use client"

import type React from "react"
import { useState } from "react"
import {
  File,
  Code,
  Brain,
  Search,
  Link2,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Download,
  Share,
  Copy,
  Eye,
  GitBranch,
  Clock,
  Users,
  Zap,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  MoreVertical,
  Filter,
  SortAsc,
  FileIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppSidebar } from "@/custom-components/app-sidebar"
import { TopBar } from "@/custom-components/top-bar"
import { useSearchParams } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  isOpen?: boolean
  size?: string
  lastModified?: string
  language?: string
}

const fileTree: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        isOpen: true,
        children: [
          {
            id: "3",
            name: "ui",
            type: "folder",
            children: [
              {
                id: "4",
                name: "button.tsx",
                type: "file",
                size: "2.1 KB",
                lastModified: "2 hours ago",
                language: "typescript",
              },
              {
                id: "5",
                name: "card.tsx",
                type: "file",
                size: "1.8 KB",
                lastModified: "1 day ago",
                language: "typescript",
              },
              {
                id: "6",
                name: "input.tsx",
                type: "file",
                size: "1.2 KB",
                lastModified: "3 days ago",
                language: "typescript",
              },
            ],
          },
          {
            id: "7",
            name: "layout",
            type: "folder",
            children: [
              {
                id: "8",
                name: "header.tsx",
                type: "file",
                size: "3.2 KB",
                lastModified: "5 hours ago",
                language: "typescript",
              },
              {
                id: "9",
                name: "sidebar.tsx",
                type: "file",
                size: "4.1 KB",
                lastModified: "1 day ago",
                language: "typescript",
              },
            ],
          },
        ],
      },
      {
        id: "10",
        name: "pages",
        type: "folder",
        children: [
          {
            id: "11",
            name: "dashboard.tsx",
            type: "file",
            size: "5.3 KB",
            lastModified: "30 minutes ago",
            language: "typescript",
          },
          {
            id: "12",
            name: "settings.tsx",
            type: "file",
            size: "3.7 KB",
            lastModified: "2 hours ago",
            language: "typescript",
          },
        ],
      },
      {
        id: "13",
        name: "utils",
        type: "folder",
        children: [
          {
            id: "14",
            name: "helpers.ts",
            type: "file",
            size: "2.8 KB",
            lastModified: "1 week ago",
            language: "typescript",
          },
          {
            id: "15",
            name: "constants.ts",
            type: "file",
            size: "1.1 KB",
            lastModified: "3 days ago",
            language: "typescript",
          },
        ],
      },
    ],
  },
  {
    id: "16",
    name: "public",
    type: "folder",
    children: [
      { id: "17", name: "images", type: "folder", children: [] },
      { id: "18", name: "favicon.ico", type: "file", size: "4.2 KB", lastModified: "1 month ago" },
    ],
  },
  {
    id: "19",
    name: "package.json",
    type: "file",
    size: "1.8 KB",
    lastModified: "2 days ago",
    language: "json",
  },
  {
    id: "20",
    name: "README.md",
    type: "file",
    size: "3.2 KB",
    lastModified: "1 week ago",
    language: "markdown",
  },
]

function FileTreeNode({
  node,
  level = 0,
  onSelect,
}: { node: FileNode; level?: number; onSelect: (node: FileNode) => void }) {
  const [isOpen, setIsOpen] = useState(node.isOpen || false)

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen)
    } else {
      onSelect(node)
    }
  }

  const getFileIcon = (node: FileNode) => {
    if (node.type === "folder") {
      return isOpen ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />
    }

    switch (node.language) {
      case "typescript":
        return <FileText className="w-4 h-4 text-blue-600" />
      case "javascript":
        return <FileText className="w-4 h-4 text-yellow-600" />
      case "json":
        return <FileText className="w-4 h-4 text-green-600" />
      case "markdown":
        return <FileText className="w-4 h-4 text-gray-600" />
      default:
        return <File className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-accent/50 cursor-pointer rounded-sm group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === "folder" && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </div>
        )}
        {node.type === "file" && <div className="w-4" />}
        {getFileIcon(node)}
        <span className="text-sm flex-1 truncate">{node.name}</span>
        {node.type === "file" && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {node.size}
          </span>
        )}
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode key={child.id} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function FileTreePanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)

  const handleFileSelect = (node: FileNode) => {
    setSelectedFile(node)
  }

  return (
    <Card className="w-80 h-full rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <SidebarTrigger />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <FileIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl text-black font-bold leading-tight">Explorer</h1>
            </div>
          </CardTitle>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Filter className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Filter files</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <SortAsc className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sort files</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {fileTree.map((node) => (
              <FileTreeNode key={node.id} node={node} onSelect={handleFileSelect} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function CodeViewerPanel() {
  const [selectedFile, setSelectedFile] = useState("dashboard.tsx")

  const sampleCode = `import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-green-600">{change}</p>
          </div>
          <div className="text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change="+20.1% from last month"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Active Users"
          value="2,350"
          change="+180.1% from last month"
          icon={<Users className="w-6 h-6" />}
        />
      </div>
    </div>
  )
}`

  return (
    <Card className="flex-1 h-full rounded-none border-0 flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5" />
            <div className="space-y-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-sm">
                      src
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-sm">
                      pages
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm font-medium">{selectedFile}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Modified 30 minutes ago</span>
                <Separator orientation="vertical" className="h-3" />
                <GitBranch className="w-3 h-3" />
                <span>feature/dashboard</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              TypeScript
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy file path
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download file
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Share file
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in editor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex">
          {/* Line Numbers */}
          <div className="w-12 bg-muted/30 border-r border-border flex flex-col text-xs text-muted-foreground font-mono">
            <div className="p-2 border-b border-border text-center font-medium">
              <Eye className="w-3 h-3 mx-auto" />
            </div>
            <div className="flex-1 py-2">
              {Array.from({ length: 50 }, (_, i) => (
                <div key={i + 1} className="px-2 py-0.5 text-right leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Code Content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <pre className="text-sm font-mono leading-6 whitespace-pre-wrap">
                <code className="language-typescript">{sampleCode}</code>
              </pre>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

function AiInsightCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: string
}) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          <Button variant="ghost" size="sm" className="h-7 text-xs p-2">
            {action}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function AiContextualPanel() {
  const insights = [
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Performance Optimization",
      description: "This component could benefit from React.memo to prevent unnecessary re-renders.",
      action: "Apply optimization",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      title: "Accessibility Issue",
      description: "Missing alt text for images and ARIA labels for interactive elements.",
      action: "Fix accessibility",
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      title: "Documentation",
      description: "Add JSDoc comments to improve code documentation and IntelliSense.",
      action: "Generate docs",
    },
    {
      icon: <CheckCircle className="w-4 h-4" />,
      title: "Best Practices",
      description: "Code follows React and TypeScript best practices. Well structured!",
      action: "View details",
    },
  ]

  const dependencies = [
    { name: "StatCard", type: "Component", file: "components/ui/stat-card.tsx" },
    { name: "Card", type: "UI Component", file: "components/ui/card.tsx" },
    { name: "Button", type: "UI Component", file: "components/ui/button.tsx" },
    { name: "lucide-react", type: "Icon Library", file: "node_modules" },
  ]

  return (
    <Card className="w-96 h-full rounded-none border-l border-r-0 border-t-0 border-b-0 flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Lens
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 flex-1">
            <Search className="w-3 h-3 mr-1" />
            Explain Code
          </Button>
          <Button variant="outline" size="sm" className="h-8 flex-1">
            <Link2 className="w-3 h-3 mr-1" />
            Find Relations
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="insights" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
            <TabsTrigger value="insights" className="text-xs">
              Insights
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="text-xs">
              Dependencies
            </TabsTrigger>
            <TabsTrigger value="usage" className="text-xs">
              Usage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {insights.map((insight, index) => (
                  <AiInsightCard key={index} {...insight} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dependencies" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {dependencies.map((dep, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{dep.name}</div>
                      <div className="text-xs text-muted-foreground">{dep.type}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="usage" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">Usage Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      This component is used in 3 places across your application.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View All Usages
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function CodeExplorerPage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <FileTreePanel />
      <CodeViewerPanel />
      <AiContextualPanel />
    </div>
  )
}
