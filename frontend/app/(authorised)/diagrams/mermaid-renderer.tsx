"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidRendererProps {
  code: string
}

export default function MermaidRenderer({ code }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "sans-serif",
    })

    const renderDiagram = async () => {
      try {
        setError(null)
        const { svg } = await mermaid.render("mermaid-diagram", code)
        setSvg(svg)
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError("Error rendering diagram. Please check your syntax.")
      }
    }

    renderDiagram()
  }, [code])

  return (
    <div ref={containerRef} className="w-full h-full">
      {error ? (
        <div className="p-4 text-red-500 border border-red-300 rounded bg-red-50">{error}</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full h-full" />
      )}
    </div>
  )
}
