import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Move, Trash2, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

function PropertiesPanel() {
  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Element Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Element</Label>
          <Select defaultValue="none">
            <SelectTrigger>
              <SelectValue placeholder="Select element" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No selection</SelectItem>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="arrow">Arrow</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Style Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Style</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-xs">Fill Color</Label>
              <div className="w-full h-8 bg-primary rounded border cursor-pointer"></div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Border Color</Label>
              <div className="w-full h-8 bg-border rounded border cursor-pointer"></div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Border Width</Label>
            <Slider defaultValue={[2]} max={10} min={0} step={1} />
          </div>
        </div>

        {/* Text Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Text</Label>
          <Input placeholder="Enter text..." />
          <div className="grid grid-cols-2 gap-2">
            <Select defaultValue="16">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="20">20px</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="normal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
                <SelectItem value="italic">Italic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Position Properties */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">X</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Y</Label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input type="number" placeholder="100" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input type="number" placeholder="100" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Move className="w-4 h-4 mr-2" />
            Bring to Front
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertiesPanel;