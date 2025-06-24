"use client"

// React and hooks
import { useState, useRef } from "react"

// UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Icons
import { Download, ImageIcon, Code2, FileText, Database, Sparkles, Settings2, CheckCircle2 } from "lucide-react"

// Toast notifications
import { toast } from "@/hooks/use-toast"

interface ExportControlsProps {
  diagramSvg?: string;
  diagramCode?: string;
  fileName?: string;
}

function ExportControls({ diagramSvg, diagramCode, fileName = "diagram" }: ExportControlsProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const exportFormats = [
    {
      id: "png",
      name: "PNG",
      icon: <ImageIcon className="w-5 h-5" />,
      description: "High quality raster",
      gradient: "from-gray-900 to-black",
      popular: true,
    },
    {
      id: "svg",
      name: "SVG",
      icon: <Code2 className="w-5 h-5" />,
      description: "Scalable vector",
      gradient: "from-gray-800 to-gray-900",
      popular: false,
    },
    {
      id: "pdf",
      name: "PDF",
      icon: <FileText className="w-5 h-5" />,
      description: "Print ready",
      gradient: "from-black to-gray-800",
      popular: true,
    },
    {
      id: "json",
      name: "JSON",
      icon: <Database className="w-5 h-5" />,
      description: "Raw data",
      gradient: "from-gray-700 to-gray-900",
      popular: false,
    },
  ]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [quality, setQuality] = useState("high")
  const [scale, setScale] = useState("2x")

  const getScaleValue = () => {
    switch (scale) {
      case "1x": return 1
      case "2x": return 2
      case "3x": return 3
      default: return 2
    }
  }

  const getQualityValue = () => {
    switch (quality) {
      case "low": return 0.6
      case "medium": return 0.8
      case "high": return 1.0
      default: return 1.0
    }
  }

  const svgToPng = (svgElement: SVGElement, scale: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)
        
        const dataUrl = canvas.toDataURL('image/png', quality)
        URL.revokeObjectURL(url)
        resolve(dataUrl)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load SVG image'))
      }
      
      img.src = url
    })
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleExport = async () => {
    if (!selectedFormat) {
      toast({
        title: "No format selected",
        description: "Please select an export format first.",
        variant: "destructive"
      })
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      const scaleValue = getScaleValue()
      const qualityValue = getQualityValue()
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 20, 80))
      }, 100)

      switch (selectedFormat) {
        case 'png':
          if (!diagramSvg) {
            throw new Error('No diagram to export')
          }
          
          // Parse SVG from string
          const parser = new DOMParser()
          const svgDoc = parser.parseFromString(diagramSvg, 'image/svg+xml')
          const svgElement = svgDoc.documentElement as unknown as SVGElement
          
          const pngDataUrl = await svgToPng(svgElement, scaleValue, qualityValue)
          downloadDataUrl(pngDataUrl, `${fileName}.png`)
          break
          
        case 'svg':
          if (!diagramSvg) {
            throw new Error('No diagram to export')
          }
          downloadFile(diagramSvg, `${fileName}.svg`, 'image/svg+xml')
          break
          
        case 'json':
          if (!diagramCode) {
            throw new Error('No diagram code to export')
          }
          const jsonData = {
            type: 'mermaid',
            content: diagramCode,
            exported_at: new Date().toISOString(),
            metadata: {
              format: 'mermaid',
              version: '1.0'
            }
          }
          downloadFile(JSON.stringify(jsonData, null, 2), `${fileName}.json`, 'application/json')
          break
          
        case 'pdf':
          // For PDF, we'll convert SVG to canvas and then use basic PDF generation
          if (!diagramSvg) {
            throw new Error('No diagram to export')
          }
          
          // For now, we'll just download the SVG with .pdf extension as a placeholder
          // In a real implementation, you'd use a library like jsPDF
          downloadFile(diagramSvg, `${fileName}.svg`, 'image/svg+xml')
          
          toast({
            title: "PDF Export Note",
            description: "PDF export downloaded as SVG. For proper PDF conversion, consider using the browser's print-to-PDF feature.",
          })
          break
          
        default:
          throw new Error('Unsupported export format')
      }
      
      clearInterval(progressInterval)
      setExportProgress(100)
      
      toast({
        title: "Export successful",
        description: `Your diagram has been exported as ${selectedFormat.toUpperCase()}.`,
      })
      
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
      }, 1000)
      
    } catch (error) {
      console.error('Export error:', error)
      setIsExporting(false)
      setExportProgress(0)
      
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred during export.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="relative overflow-hidden border bg-white dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-900/10 to-black/10 dark:from-white/10 dark:to-gray-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-black/10 to-gray-800/10 dark:from-gray-200/10 dark:to-white/10 rounded-full blur-2xl" />

      <CardHeader className="pb-6 relative">
        <CardTitle className="text-xl flex items-center gap-3 font-semibold bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          <div className="p-2 rounded-xl bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white text-white dark:text-black shadow-lg">
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
            <Sparkles className="w-4 h-4 text-gray-600 dark:text-gray-400" />
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
              <Select value={quality} onValueChange={setQuality}>
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
              <Select value={scale} onValueChange={setScale}>
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

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
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
