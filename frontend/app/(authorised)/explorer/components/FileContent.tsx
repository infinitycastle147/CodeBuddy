'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFileOperations } from '../hooks/useFileOperations';
import { useFileExplorer } from '../context/FileExplorerContext';
import { Loader2 } from 'lucide-react';

export function FileContent() {
  const { state } = useFileExplorer();
  const { getFileContent } = useFileOperations();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      if (state.selectedFile?.type === 'file') {
        setIsLoading(true);
        setError(null);
        try {
          const fileContent = await getFileContent(state.selectedFile.id);
          setContent(fileContent);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load file content');
        } finally {
          setIsLoading(false);
        }
      } else {
        setContent(null);
      }
    }

    fetchContent();
  }, [state.selectedFile, getFileContent]);

  if (!state.selectedFile) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a file to view its contents
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{state.selectedFile.name}</h2>
        <div className="text-sm text-muted-foreground">
          {state.selectedFile.size && (
            <span className="mr-4">Size: {state.selectedFile.size}</span>
          )}
          {state.selectedFile.lastModified && (
            <span>Modified: {state.selectedFile.lastModified}</span>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-2rem)] border rounded-md">
        <div className="p-4">
          {content ? (
            <pre className="text-sm font-mono whitespace-pre-wrap">
              <code>{content}</code>
            </pre>
          ) : (
            <div className="text-muted-foreground">No content available</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}