import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function ExportControls() {
  const exportFormats = [
    { id: "png", name: "PNG", icon: <FileDown className="w-4 h-4" /> },
    { id: "svg", name: "SVG", icon: <FileDown className="w-4 h-4" /> },
    { id: "pdf", name: "PDF", icon: <FileDown className="w-4 h-4" /> },
    { id: "json", name: "JSON", icon: <FileDown className="w-4 h-4" /> },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {exportFormats.map((format) => (
            <Button
              key={format.id}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2"
            >
              {format.icon}
              <span className="text-xs font-medium">{format.name}</span>
            </Button>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Quality</Label>
              <Select defaultValue="high">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Scale</Label>
              <Select defaultValue="1x">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1x">1x</SelectItem>
                  <SelectItem value="2x">2x</SelectItem>
                  <SelectItem value="3x">3x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Diagram
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExportControls;