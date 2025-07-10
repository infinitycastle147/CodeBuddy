"use client";

import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import CodeBlock from "./CodeBlock";
import MermaidDiagram from "./MermaidDiagram";

interface EnhancedMessageRendererProps {
  content: string;
  className?: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function EnhancedMessageRenderer({ content, className = "" }: EnhancedMessageRendererProps) {
  
  // Extract and process code blocks and mermaid diagrams
  const processContent = (content: string): string => {
    // Handle fenced code blocks with proper language detection
    return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      const cleanCode = code.trim();
      
      // Check if it's a mermaid diagram
      if (language.toLowerCase() === 'mermaid' || cleanCode.includes('graph') || cleanCode.includes('sequenceDiagram')) {
        return match; // Let the markdown renderer handle it, we'll catch it in the component
      }
      
      return match; // Let the markdown renderer handle it
    });
  };

  // Custom components for ReactMarkdown
  const components: Components = {
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      const code = String(children).replace(/\n$/, '');

      if (!inline) {
        // Check if it's a mermaid diagram
        if (language.toLowerCase() === 'mermaid' || 
            code.includes('graph') || 
            code.includes('sequenceDiagram') ||
            code.includes('classDiagram') ||
            code.includes('stateDiagram') ||
            code.includes('erDiagram') ||
            code.includes('gantt') ||
            code.includes('pie') ||
            code.includes('journey') ||
            code.includes('gitgraph')) {
          return <MermaidDiagram>{code}</MermaidDiagram>;
        }

        // Regular code block
        return (
          <CodeBlock
            language={language}
            showLineNumbers={code.split('\n').length > 10}
            collapsible={code.split('\n').length > 20}
          >
            {code}
          </CodeBlock>
        );
      }

      // Inline code
      return (
        <code 
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Enhanced blockquote styling
    blockquote: ({ children, ...props }) => (
      <blockquote 
        className="mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Enhanced table styling
    table: ({ children, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse border border-border" {...props}>
          {children}
        </table>
      </div>
    ),

    th: ({ children, ...props }) => (
      <th 
        className="border border-border bg-muted px-4 py-2 text-left font-bold"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td 
        className="border border-border px-4 py-2"
        {...props}
      >
        {children}
      </td>
    ),

    // Enhanced list styling
    ul: ({ children, ...props }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props}>
        {children}
      </ol>
    ),

    // Enhanced heading styling
    h1: ({ children, ...props }) => (
      <h1 className="mt-6 mb-4 text-2xl font-bold tracking-tight" {...props}>
        {children}
      </h1>
    ),

    h2: ({ children, ...props }) => (
      <h2 className="mt-6 mb-4 text-xl font-semibold tracking-tight" {...props}>
        {children}
      </h2>
    ),

    h3: ({ children, ...props }) => (
      <h3 className="mt-6 mb-4 text-lg font-semibold tracking-tight" {...props}>
        {children}
      </h3>
    ),

    h4: ({ children, ...props }) => (
      <h4 className="mt-6 mb-4 text-base font-semibold tracking-tight" {...props}>
        {children}
      </h4>
    ),

    h5: ({ children, ...props }) => (
      <h5 className="mt-6 mb-4 text-sm font-semibold tracking-tight" {...props}>
        {children}
      </h5>
    ),

    h6: ({ children, ...props }) => (
      <h6 className="mt-6 mb-4 text-sm font-semibold tracking-tight" {...props}>
        {children}
      </h6>
    ),

    // Enhanced paragraph styling
    p: ({ children, ...props }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
        {children}
      </p>
    ),

    // Enhanced link styling
    a: ({ children, href, ...props }) => (
      <a 
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),

    // Enhanced horizontal rule
    hr: ({ ...props }) => (
      <hr className="my-4 border-border" {...props} />
    ),

    // Enhanced strong/bold text
    strong: ({ children, ...props }) => (
      <strong className="font-semibold" {...props}>
        {children}
      </strong>
    ),

    // Enhanced emphasis/italic text
    em: ({ children, ...props }) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),
  };

  const processedContent = processContent(content);

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}