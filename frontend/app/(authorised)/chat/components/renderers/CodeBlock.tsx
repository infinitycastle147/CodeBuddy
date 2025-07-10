"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { createHighlighter } from "shiki";
import type { Highlighter } from "shiki";

interface CodeBlockProps {
  children: string;
  language?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  maxLines?: number;
  fileName?: string;
}

export default function CodeBlock({
  children,
  language = "text",
  showLineNumbers = false,
  collapsible = false,
  maxLines = 20,
  fileName,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const code = children.trim();
  const lines = code.split('\n');
  const shouldShowCollapse = collapsible && lines.length > maxLines;
  const displayCode = isCollapsed ? lines.slice(0, maxLines).join('\n') : code;

  // Initialize shiki highlighter
  useEffect(() => {
    const initHighlighter = async () => {
      try {
        const highlighter = await createHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: [
            'javascript',
            'typescript',
            'python',
            'java',
            'cpp',
            'c',
            'go',
            'rust',
            'html',
            'css',
            'json',
            'yaml',
            'markdown',
            'bash',
            'sql',
            'php',
            'ruby',
            'swift',
            'kotlin',
            'dart',
            'xml',
            'dockerfile',
            'text',
          ],
        });
        setHighlighter(highlighter);
      } catch (error) {
        console.error('Failed to initialize highlighter:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initHighlighter();
  }, []);

  // Highlight code when highlighter is ready or code changes
  useEffect(() => {
    if (highlighter && code) {
      try {
        const highlighted = highlighter.codeToHtml(displayCode, {
          lang: language,
          theme: 'github-light',
          transformers: [
            {
              name: 'line-numbers',
              line(node, line) {
                if (showLineNumbers) {
                  node.properties['data-line'] = line;
                }
              },
            },
          ],
        });
        setHighlightedCode(highlighted);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHighlightedCode(`<pre><code>${displayCode}</code></pre>`);
      }
    }
  }, [highlighter, displayCode, language, showLineNumbers]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast({
        title: "Code copied!",
        description: "The code has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getLanguageDisplayName = (lang: string) => {
    const langMap: Record<string, string> = {
      js: 'JavaScript',
      jsx: 'JavaScript',
      ts: 'TypeScript',
      tsx: 'TypeScript',
      py: 'Python',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      go: 'Go',
      rs: 'Rust',
      rust: 'Rust',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      yaml: 'YAML',
      yml: 'YAML',
      md: 'Markdown',
      bash: 'Bash',
      sh: 'Shell',
      sql: 'SQL',
      php: 'PHP',
      rb: 'Ruby',
      swift: 'Swift',
      kt: 'Kotlin',
      dart: 'Dart',
      xml: 'XML',
      dockerfile: 'Dockerfile',
    };
    return langMap[lang.toLowerCase()] || lang.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="my-4 overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-muted animate-pulse rounded"></div>
            {fileName && <div className="w-24 h-4 bg-muted animate-pulse rounded"></div>}
          </div>
          <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" style={{width: `${Math.random() * 40 + 60}%`}}></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="my-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {getLanguageDisplayName(language)}
          </Badge>
          {fileName && (
            <span className="text-xs text-muted-foreground">{fileName}</span>
          )}
          {lines.length > 1 && (
            <span className="text-xs text-muted-foreground">
              {lines.length} lines
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {shouldShowCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
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
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <div
          className={cn(
            "overflow-x-auto text-sm",
            showLineNumbers && "code-with-line-numbers"
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        {isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>

      {/* Footer for collapsed state */}
      {isCollapsed && (
        <div className="p-3 border-t bg-muted/30 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="text-xs"
          >
            Show {lines.length - maxLines} more lines
          </Button>
        </div>
      )}
    </Card>
  );
}