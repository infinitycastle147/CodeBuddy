"use client";

import { useState, useEffect, useRef } from "react";
import { Maximize2, Download, Copy, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  children: string;
  title?: string;
}

export default function MermaidDiagram({ children, title }: MermaidDiagramProps) {
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const code = children.trim();

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontSize: 14,
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      flowchart: {
        curve: 'linear',
        nodeSpacing: 50,
        rankSpacing: 50,
      },
      sequence: {
        diagramMarginX: 20,
        diagramMarginY: 20,
        actorMargin: 50,
      },
      gantt: {
        fontSize: 12,
        numberSectionStyles: 4,
      },
    });
  }, []);

  // Render mermaid diagram
  useEffect(() => {
    const renderDiagram = async () => {
      if (!diagramRef.current || !code) return;

      try {
        setIsRendering(true);
        setError(null);

        // Generate unique ID for the diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Clear previous content
        diagramRef.current.innerHTML = '';

        // Validate and render the diagram
        const validation = await mermaid.parse(code);
        if (!validation) {
          throw new Error('Invalid mermaid syntax');
        }

        const { svg } = await mermaid.render(id, code);
        setSvgContent(svg);
        
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Mermaid rendering error:', err);
      } finally {
        setIsRendering(false);
      }
    };

    renderDiagram();
  }, [code]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast({
        title: "Diagram code copied!",
        description: "The mermaid diagram code has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy diagram code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadSVG = () => {
    if (!svgContent) return;

    try {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'mermaid-diagram'}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "The diagram has been downloaded as an SVG file.",
      });
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download the diagram.",
        variant: "destructive",
      });
    }
  };

  const downloadPNG = () => {
    if (!svgContent) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title || 'mermaid-diagram'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Download started",
              description: "The diagram has been downloaded as a PNG file.",
            });
          }
        }, 'image/png');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgContent);
    } catch {
      toast({
        title: "Download failed",
        description: "Could not download the diagram as PNG.",
        variant: "destructive",
      });
    }
  };

  const retryRender = () => {
    setError(null);
    setIsRendering(true);
    // Trigger re-render by updating the key
    if (diagramRef.current) {
      diagramRef.current.innerHTML = '';
    }
  };

  const detectDiagramType = (code: string): string => {
    const lines = code.split('\n');
    const firstLine = lines[0]?.trim().toLowerCase();
    
    if (firstLine?.includes('graph')) return 'Flowchart';
    if (firstLine?.includes('sequencediagram')) return 'Sequence';
    if (firstLine?.includes('classDiagram')) return 'Class';
    if (firstLine?.includes('stateDiagram')) return 'State';
    if (firstLine?.includes('erDiagram')) return 'ER';
    if (firstLine?.includes('gantt')) return 'Gantt';
    if (firstLine?.includes('pie')) return 'Pie Chart';
    if (firstLine?.includes('journey')) return 'User Journey';
    if (firstLine?.includes('gitgraph')) return 'Git Graph';
    
    return 'Diagram';
  };

  return (
    <Card className="my-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Mermaid {detectDiagramType(code)}
          </Badge>
          {title && (
            <span className="text-xs text-muted-foreground">{title}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <Button
              variant="ghost"
              size="sm"
              onClick={retryRender}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          {svgContent && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadSVG}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>{title || 'Mermaid Diagram'}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center p-4">
                    <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button onClick={downloadSVG} size="sm">
                      Download SVG
                    </Button>
                    <Button onClick={downloadPNG} size="sm">
                      Download PNG
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isRendering && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Rendering diagram...</span>
            </div>
          </div>
        )}

        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Diagram Error:</strong> {error}
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Show diagram code</summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                  {code}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {!isRendering && !error && (
          <div className="flex justify-center">
            <div 
              ref={diagramRef}
              className="mermaid-diagram max-w-full"
              style={{ 
                maxWidth: '100%',
                overflow: 'auto'
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}