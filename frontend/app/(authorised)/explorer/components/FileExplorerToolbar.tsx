"use client";

import {
  Search,
  Filter,
  SortAsc,
  Download,
  Share,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileExplorerToolbarProps {
  onSearch: (query: string) => void;
  onFilter: (type: string) => void;
  onSort: (criteria: string) => void;
  onDownload: () => void;
  onShare: () => void;
  onCopy: () => void;
}

export function FileExplorerToolbar({
  onSearch,
  onFilter,
  onSort,
  onDownload,
  onShare,
  onCopy,
}: FileExplorerToolbarProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilter("all")}>
              All Files
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("typescript")}>
              TypeScript
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("javascript")}>
              JavaScript
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("name")}>
              Sort by Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("size")}>
              Sort by Size
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("modified")}>
              Sort by Modified
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onShare}>
          <Share className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}