import React from "react";
import {
  BarChart,
  Database,
  Workflow,
  Network,
  GitBranch,
  Sparkles,
  Code,
  Users,
  Calendar,
  Clock,
  Layers,
  Boxes,
  Cloud,
  PieChart,
  TrendingUp,
  Target,
  Share2,
  Brain,
  FileText,
  Route,
  Activity,
} from "lucide-react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

export type DiagramType = 
  | "flowchart"
  | "user-journey"
  | "gantt"
  | "timeline"
  | "kanban"
  | "sequence"
  | "class"
  | "state"
  | "c4"
  | "block"
  | "architecture"
  | "zenuml"
  | "erd"
  | "pie"
  | "xy-chart"
  | "radar"
  | "sankey"
  | "quadrant-chart"
  | "mindmap"
  | "requirement"
  | "gitgraph"
  | "packet"
  | "custom";

export interface DiagramTypeInfo {
  id: DiagramType;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

/**
 * Returns the appropriate icon for a given diagram type
 * @param type - The diagram type identifier
 * @param className - Optional CSS classes for the icon
 * @returns React node containing the icon
 */
export function getTypeIcon(type: DiagramType | string, className?: string): React.ReactNode {
  const iconProps = { className: className || "w-5 h-5" };
  
  switch (type) {
    // Process
    case "flowchart":
      return React.createElement(Workflow, iconProps);
    case "user-journey":
      return React.createElement(Users, iconProps);
    case "gantt":
      return React.createElement(Calendar, iconProps);
    case "timeline":
      return React.createElement(Clock, iconProps);
    case "kanban":
      return React.createElement(Layers, iconProps);
    
    // Architecture
    case "sequence":
      return React.createElement(ArrowRight, iconProps);
    case "class":
      return React.createElement(Code, iconProps);
    case "state":
      return React.createElement(Activity, iconProps);
    case "c4":
      return React.createElement(Boxes, iconProps);
    case "block":
      return React.createElement(Network, iconProps);
    case "architecture":
      return React.createElement(Cloud, iconProps);
    case "zenuml":
      return React.createElement(Code, iconProps);
    
    // Data
    case "erd":
      return React.createElement(Database, iconProps);
    case "pie":
      return React.createElement(PieChart, iconProps);
    case "xy-chart":
      return React.createElement(TrendingUp, iconProps);
    case "radar":
      return React.createElement(Target, iconProps);
    case "sankey":
      return React.createElement(Share2, iconProps);
    
    // Strategy
    case "quadrant-chart":
      return React.createElement(BarChart, iconProps);
    case "mindmap":
      return React.createElement(Brain, iconProps);
    case "requirement":
      return React.createElement(FileText, iconProps);
    
    // Technical
    case "gitgraph":
      return React.createElement(GitBranch, iconProps);
    case "packet":
      return React.createElement(Route, iconProps);
    
    // Custom
    case "custom":
      return React.createElement(Sparkles, iconProps);
    
    // Default fallback
    default:
      return React.createElement(Workflow, iconProps);
  }
}

/**
 * Returns the category for a given diagram type
 * @param type - The diagram type identifier
 * @returns The category string
 */
export function getDiagramCategory(type: DiagramType | string): string {
  switch (type) {
    case "flowchart":
    case "user-journey":
    case "gantt":
    case "timeline":
    case "kanban":
      return "Process";
    
    case "sequence":
    case "class":
    case "state":
    case "c4":
    case "block":
    case "architecture":
    case "zenuml":
      return "Architecture";
    
    case "erd":
    case "pie":
    case "xy-chart":
    case "radar":
    case "sankey":
      return "Data";
    
    case "quadrant-chart":
    case "mindmap":
    case "requirement":
      return "Strategy";
    
    case "gitgraph":
    case "packet":
      return "Technical";
    
    case "custom":
      return "Custom";
    
    default:
      return "Process";
  }
}

/**
 * Returns the display name for a given diagram type
 * @param type - The diagram type identifier
 * @returns The human-readable name
 */
export function getDiagramDisplayName(type: DiagramType | string): string {
  switch (type) {
    case "flowchart":
      return "Flowchart";
    case "user-journey":
      return "User Journey";
    case "gantt":
      return "Gantt";
    case "timeline":
      return "Timeline";
    case "kanban":
      return "Kanban";
    case "sequence":
      return "Sequence Diagram";
    case "class":
      return "Class Diagram";
    case "state":
      return "State Diagram";
    case "c4":
      return "C4";
    case "block":
      return "Block";
    case "architecture":
      return "Architecture";
    case "zenuml":
      return "ZenUML";
    case "erd":
      return "Entity Relationship Diagram";
    case "pie":
      return "Pie";
    case "xy-chart":
      return "XY Chart";
    case "radar":
      return "Radar";
    case "sankey":
      return "Sankey";
    case "quadrant-chart":
      return "Quadrant Chart";
    case "mindmap":
      return "Mindmap";
    case "requirement":
      return "Requirement Diagram";
    case "gitgraph":
      return "Gitgraph";
    case "packet":
      return "Packet";
    case "custom":
      return "Custom Diagram";
    default:
      return "Flowchart";
  }
}

/**
 * Returns the CSS color classes for a given diagram type
 * @param type - The diagram type identifier
 * @returns CSS classes for styling
 */
export function getDiagramTypeColor(type: DiagramType | string): string {
  const category = getDiagramCategory(type);
  
  switch (category) {
    case "Process":
      return "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20";
    case "Architecture":
      return "bg-purple-500/10 border-purple-200 hover:bg-purple-500/20";
    case "Data":
      return "bg-green-500/10 border-green-200 hover:bg-green-500/20";
    case "Strategy":
      return "bg-orange-500/10 border-orange-200 hover:bg-orange-500/20";
    case "Technical":
      return "bg-cyan-500/10 border-cyan-200 hover:bg-cyan-500/20";
    case "Custom":
      return "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200 hover:from-violet-500/20 hover:to-purple-500/20";
    default:
      return "bg-blue-500/10 border-blue-200 hover:bg-blue-500/20";
  }
}

/**
 * Returns complete diagram type information
 * @param type - The diagram type identifier
 * @returns Complete diagram type info object
 */
export function getDiagramTypeInfo(type: DiagramType | string): DiagramTypeInfo {
  return {
    id: type as DiagramType,
    name: getDiagramDisplayName(type),
    icon: getTypeIcon(type),
    description: getDiagramDescription(type),
    category: getDiagramCategory(type),
  };
}

/**
 * Returns the description for a given diagram type
 * @param type - The diagram type identifier
 * @returns The description string
 */
export function getDiagramDescription(type: DiagramType | string): string {
  switch (type) {
    case "flowchart":
      return "Process modeling and decision flows";
    case "user-journey":
      return "Experience design and satisfaction mapping";
    case "gantt":
      return "Project management and timeline planning";
    case "timeline":
      return "Chronological events and milestones";
    case "kanban":
      return "Task management and workflow visualization";
    case "sequence":
      return "System interaction patterns";
    case "class":
      return "Software architecture and object relationships";
    case "state":
      return "Behavioral state modeling";
    case "c4":
      return "Software architecture at different abstraction levels";
    case "block":
      return "Infrastructure layout and component relationships";
    case "architecture":
      return "Cloud systems and service relationships";
    case "zenuml":
      return "Programming-focused sequence interactions";
    case "erd":
      return "Database design and data relationships";
    case "pie":
      return "Proportional data and business intelligence";
    case "xy-chart":
      return "Numerical trends and comparisons";
    case "radar":
      return "Multi-dimensional performance analysis";
    case "sankey":
      return "Flow analysis and resource allocation";
    case "quadrant-chart":
      return "Decision frameworks and prioritization";
    case "mindmap":
      return "Information organization and brainstorming";
    case "requirement":
      return "Requirements engineering and traceability";
    case "gitgraph":
      return "Version control and branching strategies";
    case "packet":
      return "Network protocol visualization";
    case "custom":
      return "Create a custom diagram with AI assistance";
    default:
      return "Process modeling and decision flows";
  }
}

/**
 * Returns all available diagram types
 * @returns Array of all diagram type identifiers
 */
export function getAllDiagramTypes(): DiagramType[] {
  return [
    "flowchart",
    "user-journey",
    "gantt",
    "timeline",
    "kanban",
    "sequence",
    "class",
    "state",
    "c4",
    "block",
    "architecture",
    "zenuml",
    "erd",
    "pie",
    "xy-chart",
    "radar",
    "sankey",
    "quadrant-chart",
    "mindmap",
    "requirement",
    "gitgraph",
    "packet",
    "custom",
  ];
}