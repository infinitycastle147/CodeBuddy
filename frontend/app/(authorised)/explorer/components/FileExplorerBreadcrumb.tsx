"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface FileExplorerBreadcrumbProps {
  path: string[];
  onNavigate: (index: number) => void;
}

export function FileExplorerBreadcrumb({
  path,
  onNavigate,
}: FileExplorerBreadcrumbProps) {
  return (
    <Breadcrumb className="p-4">
      <BreadcrumbList>
        {path.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index < path.length - 1 ? (
              <>
                <BreadcrumbLink
                  className="hover:underline cursor-pointer"
                  onClick={() => onNavigate(index)}
                >
                  {item}
                </BreadcrumbLink>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              </>
            ) : (
              <BreadcrumbPage>{item}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}