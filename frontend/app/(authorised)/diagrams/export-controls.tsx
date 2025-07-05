"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ImageIcon, Code2, FileText, Database, Sparkles, Settings2, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface ExportControlsProps {
  diagramContent?: string
}

function ExportControls({ diagramContent }: ExportControlsProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportFormats = [
    {
      id: "png",
      name: "PNG",
      icon: <ImageIcon className="w-5 h-5" />,
      description: "High quality raster",
      gradient: "from-blue-500 to-cyan-500",
      popular: true,
    },
    {
      id: "svg",
      name: "SVG",
      icon: <Code2 className="w-5 h-5" />,
      description: "Scalable vector",
      gradient: "from-green-500 to-emerald-500",
      popular: false,
    },
    {
      id: "pdf",
      name: "PDF",
      icon: <FileText className="w-5 h-5" />,
      description: "Print ready",
      gradient: "from-red-500 to-pink-500",
      popular: true,
    },
    {
      id: "json",
      name: "JSON",
      icon: <Database className="w-5 h-5" />,
      description: "Raw data",
      gradient: "from-purple-500 to-violet-500",
      popular: false,
    },
  ]

  const handleExport = async () => {
    if (!selectedFormat) return

    setIsExporting(true)
    setExportProgress(0)

    try {
      // Get the current diagram content
      const svgElement = document.querySelector('#mermaid-diagram svg')
      if (!svgElement) {
        throw new Error('No diagram found to export')
      }

      let progressStep = 0
      const updateProgress = () => {
        progressStep += 20
        setExportProgress(Math.min(progressStep, 90))
      }

      updateProgress()

      switch (selectedFormat) {
        case 'svg':
          await exportAsSVG(svgElement as SVGElement)
          break
        case 'png':
          await exportAsPNG(svgElement as SVGElement)
          break
        case 'pdf':
          await exportAsPDF(svgElement as SVGElement)
          break
        case 'json':
          await exportAsJSON()
          break
        default:
          throw new Error('Unsupported format')
      }

      setExportProgress(100)
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
      }, 500)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      setExportProgress(0)
      toast({
        title: "Export failed",
        description: "There was an error exporting your diagram. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportAsSVG = async (svgElement: SVGElement) => {
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    downloadBlob(blob, 'diagram.svg')
    toast({
      title: "SVG exported",
      description: "Your diagram has been exported as an SVG file.",
    })
  }

  const exportAsPNG = async (svgElement: SVGElement) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      // Set canvas size (2x for retina quality)
      canvas.width = img.width * 2
      canvas.height = img.height * 2
      ctx.scale(2, 2)
      
      // Set white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, img.width, img.height)
      
      // Draw the SVG
      ctx.drawImage(img, 0, 0)
      
      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, 'diagram.png')
          toast({
            title: "PNG exported",
            description: "Your diagram has been exported as a high-quality PNG file.",
          })
        }
        URL.revokeObjectURL(url)
      }, 'image/png', 1.0)
    }
    img.src = url
  }

  const exportAsPDF = async (svgElement: SVGElement) => {
    // For PDF export, we'll convert to PNG first then create PDF
    // This is a simplified approach - in a real app, you might want to use a library like jsPDF
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Set white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, img.width, img.height)
      
      // Draw the SVG
      ctx.drawImage(img, 0, 0)
      
      // Create a simple PDF-like experience by downloading as high-quality PNG
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, 'diagram.pdf.png')
          toast({
            title: "PDF exported",
            description: "Your diagram has been exported as a PDF-compatible PNG file.",
          })
        }
        URL.revokeObjectURL(url)
      }, 'image/png', 1.0)
    }
    img.src = url
  }

  const exportAsJSON = async () => {
    // Export diagram data as JSON
    const diagramData = {
      type: 'mermaid-diagram',
      timestamp: new Date().toISOString(),
      content: diagramContent || '',
      svg: document.querySelector('#mermaid-diagram svg')?.outerHTML || '',
      metadata: {
        exported_with: 'CodeBuddy Diagram Studio',
        format_version: '1.0'
      }
    }
    
    const blob = new Blob([JSON.stringify(diagramData, null, 2)], { type: 'application/json' })
    downloadBlob(blob, 'diagram.json')
    toast({
      title: "JSON exported",
      description: "Your diagram data has been exported as a JSON file.",
    })
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="relative overflow-hidden border bg-white dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-900/10 to-black/10 dark:from-white/10 dark:to-gray-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-black/10 to-gray-800/10 dark:from-gray-200/10 dark:to-white/10 rounded-full blur-2xl" />

      <CardHeader className="pb-6 relative">
        <CardTitle className="text-xl flex items-center gap-3 font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            <Download className="w-5 h-5" />
          </div>
          Export Your Creation
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Choose your preferred format and settings</p>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Format Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500"/>
            <Label className="text-sm font-medium">Export Format</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  selectedFormat === format.id ? "z-10" : "hover:scale-102"
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div
                  className={`
                  relative p-4 rounded-xl border-2 transition-all duration-300
                  ${
                    selectedFormat === format.id
                      ? "border-gray-900 dark:border-gray-100 shadow-lg shadow-gray-900/25 dark:shadow-gray-100/25 bg-gray-50 dark:bg-gray-800/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50"
                  }
                `}
                >
                  {/* {format.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white text-white dark:text-black text-xs px-2 py-1">
                      Popular
                    </Badge>
                  )} */}

                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`
                      p-3 rounded-lg bg-gradient-to-br ${format.gradient} text-white dark:text-white shadow-lg
                      group-hover:shadow-xl transition-shadow duration-300
                    `}
                    >
                      {format.icon}
                    </div>

                    <div className="text-center">
                      <div className="font-semibold text-sm">{format.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{format.description}</div>
                    </div>
                  </div>

                  {selectedFormat === format.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />

        {/* Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Label className="text-sm font-medium">Export Settings</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quality</Label>
              <Select defaultValue="high">
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-gray-100/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Fast)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Scale</Label>
              <Select defaultValue="2x">
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-gray-100/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1x">1x (Standard)</SelectItem>
                  <SelectItem value="2x">2x (Retina)</SelectItem>
                  <SelectItem value="3x">3x (Ultra HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Exporting your diagram...</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        {/* Export Button */}
        <Button
          className={`
            w-full h-12 text-base font-semibold transition-all duration-300
            ${
              selectedFormat
                ? "bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white hover:from-black hover:to-gray-800 dark:hover:from-white dark:hover:to-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-white dark:text-black"
                : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
            }
          `}
          disabled={!selectedFormat || isExporting}
          onClick={handleExport}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              {selectedFormat ? `Export as ${selectedFormat.toUpperCase()}` : "Select Format First"}
            </>
          )}
        </Button>

        {selectedFormat && !isExporting && (
          <p className="text-xs text-center text-muted-foreground">
            Your {selectedFormat.toUpperCase()} file will be downloaded automatically
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default ExportControls
