"use client";

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
  
  // Known programming languages that should use CodeBlock
  const PROGRAMMING_LANGUAGES = [
    'javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx',
    'python', 'py', 'java', 'c', 'cpp', 'c++', 'csharp', 'c#',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart',
    'html', 'css', 'scss', 'sass', 'less',
    'sql', 'json', 'yaml', 'yml', 'xml', 'toml',
    'bash', 'shell', 'sh', 'zsh', 'powershell', 'cmd',
    'dockerfile', 'makefile', 'gitignore',
    'regex', 'markdown', 'md'
  ];

  // Check if content should be rendered as a code block vs inline code
  const shouldUseCodeBlock = (language: string, code: string) => {
    console.log('shouldUseCodeBlock called with:', { language, codeLength: code.length });
    
    // If language is specified and is a programming language
    if (language && PROGRAMMING_LANGUAGES.includes(language.toLowerCase())) {
      console.log('Language detected as programming language:', language);
      return true;
    }

    // If no language or "text", analyze content
    if (!language || language === 'text') {
      const trimmedCode = code.trim();
      
      // Short single-line content should be inline
      if (trimmedCode.split('\n').length === 1 && trimmedCode.length < 50) {
        console.log('Content is short single line, using inline');
        return false;
      }

      // Check for code-like patterns
      const codePatterns = [
        /[{}();]/,  // Common code punctuation
        /\b(function|class|def|var|let|const|if|else|for|while|return)\b/,  // Keywords
        /[=><]=?/,  // Operators
        /\w+\([^)]*\)/,  // Function calls
        /^\s*(import|from|#include|using)\b/m,  // Import statements
      ];
      
      const hasCodePattern = codePatterns.some(pattern => pattern.test(trimmedCode));
      console.log('Code pattern check result:', hasCodePattern);
      return hasCodePattern;
    }

    console.log('Default case, using CodeBlock');
    return true; // Default to CodeBlock for safety
  };

  // Analyze content type to determine optimal rendering approach
  const analyzeContent = (content: string) => {
    const trimmedContent = content.trim();
    
    // Check if content is pure code (no markdown, just code)
    const codeBlockPattern = /^```[\s\S]*```$/;
    const multipleCodeBlocks = (trimmedContent.match(/```/g) || []).length > 2;
    const hasMarkdownElements = /(?:^|\n)(#{1,6}\s|[\*\-\+]\s|\d+\.\s|\[.*\]\(.*\)|!\[.*\]\(.*\))/m.test(trimmedContent);
    const hasFencedCodeBlocks = /```/.test(trimmedContent);
    
    return {
      isPureCode: codeBlockPattern.test(trimmedContent) && !multipleCodeBlocks,
      hasMultipleCodeBlocks: multipleCodeBlocks,
      hasMarkdown: hasMarkdownElements,
      hasFencedCode: hasFencedCodeBlocks,
      contentType: codeBlockPattern.test(trimmedContent) && !multipleCodeBlocks ? 'code' : 
                   hasMarkdownElements || hasFencedCodeBlocks ? 'markdown' : 'text'
    };
  };

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
    code: ({ inline, children, ...props }: CodeProps) => {
      // Only handle inline code here - let pre handle block code
      if (inline) {
        return (
          <code 
            className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
            {...props}
          >
            {children}
          </code>
        );
      }

      // For non-inline code, return the children as-is - pre will handle the rendering
      return children;
    },

    // Handle pre element - this is where we render CodeBlock to avoid nesting issues
    pre: ({ children, ...props }) => {
      console.log('Pre component called with children:', children);
      console.log('Pre component children type:', typeof children);
      console.log('Pre component children props:', children && typeof children === 'object' ? children.props : 'no props');
      
      // Based on your debug output, the structure is different - let's handle it correctly
      if (children && typeof children === 'object' && 'props' in children) {
        const codeElement = children as React.ReactElement;
        console.log('Code element props:', codeElement.props);
        
        // The className should be directly on the props
        const className = codeElement.props?.className || '';
        const codeContent = codeElement.props?.children;
        
        console.log('Extracted:', { className, codeContent: typeof codeContent === 'string' ? codeContent.substring(0, 50) : codeContent });
        
        // Check if this has a language class
        const match = /language-(\w+)/.exec(className);
        const language = match ? match[1] : '';
        
        if (language && codeContent && typeof codeContent === 'string') {
          const code = codeContent.replace(/\n$/, '');

          console.log('Pre component processing code:', { language, className, codeLength: code.length, codePreview: code.substring(0, 50) });

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
            console.log('Rendering as Mermaid diagram');
            return <MermaidDiagram>{code}</MermaidDiagram>;
          }

          // Check if this should be a CodeBlock or simple inline code
          if (shouldUseCodeBlock(language, code)) {
            console.log('Rendering as CodeBlock');
            // Return CodeBlock directly - no wrapper to avoid nesting issues
            return (
              <CodeBlock
                language={language || 'text'}
                showLineNumbers={code.split('\n').length > 10}
                collapsible={code.split('\n').length > 20}
              >
                {code}
              </CodeBlock>
            );
          } else {
            console.log('Rendering as simple inline code');
            // For simple text, render as inline code (but in a block context)
            return (
              <div className="my-2">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {code}
                </code>
              </div>
            );
          }
        }
      }
      
      console.log('Pre component fallback');
      // Fallback to default pre rendering
      return <pre className="whitespace-pre-wrap font-mono text-sm" {...props}>{children}</pre>;
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

  const contentAnalysis = analyzeContent(content);
  const processedContent = processContent(content);

  // Render pure code content differently from mixed content
  if (contentAnalysis.isPureCode) {
    // Extract language and code from the content
    const codeMatch = content.match(/```(\w+)?\n([\s\S]*?)```/);
    if (codeMatch) {
      const [, language, code] = codeMatch;
      const trimmedCode = code.trim();
      
      // Use improved logic to determine rendering
      if (shouldUseCodeBlock(language || '', trimmedCode)) {
        return (
          <div className={className}>
            <CodeBlock
              language={language || 'text'}
              showLineNumbers={trimmedCode.split('\n').length > 10}
              collapsible={trimmedCode.split('\n').length > 20}
            >
              {trimmedCode}
            </CodeBlock>
          </div>
        );
      } else {
        // For simple text, render as inline code
        return (
          <div className={className}>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {trimmedCode}
            </code>
          </div>
        );
      }
    }
  }

  // For text-only content (no markdown), render as simple formatted text
  if (contentAnalysis.contentType === 'text') {
    return (
      <div className={className}>
        <div className="whitespace-pre-wrap leading-7 text-sm">
          {content}
        </div>
      </div>
    );
  }

  // For markdown content, use the full ReactMarkdown renderer
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}