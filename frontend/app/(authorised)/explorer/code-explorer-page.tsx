'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FileTree } from './components/FileTree';
import { FileContent } from './components/FileContent';
import { FileExplorerToolbar } from './components/FileExplorerToolbar';
import { FileExplorerBreadcrumb } from './components/FileExplorerBreadcrumb';
import { FileExplorerProvider, useFileExplorer } from './context/FileExplorerContext';
import { useFileOperations } from './hooks/useFileOperations';
import { Loader2 } from 'lucide-react';

function CodeExplorerContent() {
  const { state, handleFileSelect, handlePathNavigate, handleSearch, handleFilter, handleSort } = useFileExplorer();
  const { fetchFileTree, downloadFile, shareFile } = useFileOperations();

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  if (state.isLoading && state.fileTree.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state.error && state.fileTree.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-destructive">
        {state.error}
      </div>
    );
  }

  const handleDownload = () => {
    if (state.selectedFile?.type === 'file') {
      downloadFile(state.selectedFile.id);
    }
  };

  const handleShare = async () => {
    if (state.selectedFile?.type === 'file') {
      const shareUrl = await shareFile(state.selectedFile.id);
      if (shareUrl) {
        // TODO: Show share URL in a modal or copy to clipboard
        console.log('Share URL:', shareUrl);
      }
    }
  };

  const handleCopy = () => {
    if (state.selectedFile?.type === 'file') {
      // TODO: Implement copy file path or content
      console.log('Copy file:', state.selectedFile.id);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center h-16 px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold">Code Explorer</h1>
          </div>
        </div>
      </header>

      <FileExplorerToolbar
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onDownload={handleDownload}
        onShare={handleShare}
        onCopy={handleCopy}
      />

      <FileExplorerBreadcrumb
        path={state.currentPath}
        onNavigate={handlePathNavigate}
      />

      <div className="flex-1 flex gap-4 p-4 min-h-0">
        <Card className="flex-[0.3] p-4">
          <ScrollArea className="h-full">
            <FileTree
              data={state.fileTree}
              onSelect={handleFileSelect}
              selectedId={state.selectedFile?.id}
            />
          </ScrollArea>
        </Card>

        <Card className="flex-[0.7] p-4">
          <FileContent />
        </Card>
      </div>
    </div>
  );
}

export default function CodeExplorerPage() {
  return (
    <FileExplorerProvider>
      <CodeExplorerContent />
    </FileExplorerProvider>
  );
}
