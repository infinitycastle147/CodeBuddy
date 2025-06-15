"use client";

import { useState } from "react";
import {
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  isOpen?: boolean;
  size?: string;
  lastModified?: string;
  language?: string;
}

interface FileTreeProps {
  data: FileNode[];
  onSelect?: (node: FileNode) => void;
  selectedId?: string;
}

export function FileTree({ data, onSelect, selectedId }: FileTreeProps) {
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());

  const toggleNode = (id: string) => {
    const newOpenNodes = new Set(openNodes);
    if (newOpenNodes.has(id)) {
      newOpenNodes.delete(id);
    } else {
      newOpenNodes.add(id);
    }
    setOpenNodes(newOpenNodes);
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isOpen = openNodes.has(node.id);
    const isSelected = node.id === selectedId;

    return (
      <div key={node.id} style={{ paddingLeft: `${level * 12}px` }}>
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent/50 cursor-pointer",
            isSelected && "bg-accent"
          )}
          onClick={() => {
            if (node.type === "folder") {
              toggleNode(node.id);
            }
            onSelect?.(node);
          }}
        >
          {node.type === "folder" ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
              {isOpen ? (
                <FolderOpen className="w-4 h-4 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 shrink-0" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 shrink-0" />
            </>
          )}
          <span className="text-sm truncate">{node.name}</span>
          {node.type === "file" && (
            <span className="ml-auto text-xs text-muted-foreground">
              {node.size}
            </span>
          )}
        </div>
        {node.type === "folder" && isOpen && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="w-full">{data.map((node) => renderNode(node))}</div>;
}