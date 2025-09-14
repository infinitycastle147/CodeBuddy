export interface DiagramQuery {
  id: string;
  name: string;
  query: string;
  category: string;
}

export const diagramQueries: DiagramQuery[] = [
  // Process
  {
    id: "flowchart",
    name: "Flowchart",
    query: "Analyze the codebase and create a flowchart showing the main application workflow from user request to response. Focus on the primary business logic flow, including authentication, data processing, and error handling paths.",
    category: "Process"
  },
  {
    id: "user-journey",
    name: "User Journey",
    query: "Based on the application structure, create a user journey diagram showing the end-to-end user experience from initial access through core feature usage. Include satisfaction scores based on code complexity and error handling quality.",
    category: "Process"
  },
  {
    id: "gantt",
    name: "Gantt",
    query: "Analyze the Git history and Jira tickets to create a Gantt chart showing the development timeline of major features and releases. Include milestones, dependencies, and current sprint progress.",
    category: "Process"
  },
  {
    id: "timeline",
    name: "Timeline",
    query: "Create a timeline diagram showing the evolution of this project based on Git commits, releases, and major architectural changes. Group by development phases and highlight key milestones.",
    category: "Process"
  },
  {
    id: "kanban",
    name: "Kanban",
    query: "Generate a Kanban board representing the current development workflow based on open GitHub issues and Jira tickets. Organize by status (To Do, In Progress, Review, Done) with proper assignments and priorities.",
    category: "Process"
  },

  // Architecture
  {
    id: "sequence",
    name: "Sequence Diagram",
    query: "Analyze the API endpoints and service interactions to create a sequence diagram showing how a typical user request flows through the system. Include authentication, business logic, and data persistence layers.",
    category: "Architecture"
  },
  {
    id: "class",
    name: "Class Diagram",
    query: "Examine the codebase structure and create a class diagram showing the main domain models, their relationships, and key methods. Focus on the core business entities and their interactions.",
    category: "Architecture"
  },
  {
    id: "state",
    name: "State Diagram",
    query: "Based on the application logic, create a state diagram showing the lifecycle of the main business entity (user, order, task, etc.) and how it transitions between different states.",
    category: "Architecture"
  },
  {
    id: "c4",
    name: "C4",
    query: "Create a C4 container diagram showing the high-level architecture of this system. Include web applications, APIs, databases, and external services based on the codebase structure and dependencies.",
    category: "Architecture"
  },
  {
    id: "block",
    name: "Block",
    query: "Analyze the system architecture and create a block diagram showing the deployment structure, including frontend components, backend services, databases, and their connections.",
    category: "Architecture"
  },
  {
    id: "architecture",
    name: "Architecture",
    query: "Create an architecture diagram showing the cloud infrastructure and service relationships based on deployment configurations, Docker files, and service dependencies found in the codebase.",
    category: "Architecture"
  },
  {
    id: "zenuml",
    name: "ZenUML",
    query: "Generate a ZenUML sequence diagram showing the detailed method calls and object interactions for the core business process, including error handling and validation flows.",
    category: "Architecture"
  },

  // Data
  {
    id: "erd",
    name: "Entity Relationship Diagram",
    query: "Analyze the database schema, models, and migrations to create an ER diagram showing entity relationships, foreign keys, and cardinalities. Include the main business entities and their associations.",
    category: "Data"
  },
  {
    id: "pie",
    name: "Pie",
    query: "Create a pie chart showing the codebase composition by language, file types, or module sizes. Use actual metrics from the repository to show proportional distribution.",
    category: "Data"
  },
  {
    id: "xy-chart",
    name: "XY Chart",
    query: "Generate an XY chart showing project metrics over time, such as code complexity, test coverage, or commit frequency based on Git history and code analysis.",
    category: "Data"
  },
  {
    id: "radar",
    name: "Radar",
    query: "Create a radar chart comparing different modules or components of the system across dimensions like complexity, test coverage, documentation quality, and maintainability.",
    category: "Data"
  },
  {
    id: "sankey",
    name: "Sankey",
    query: "Analyze the data flow through the application and create a Sankey diagram showing how information moves from input sources through processing layers to output destinations.",
    category: "Data"
  },

  // Strategy
  {
    id: "quadrant-chart",
    name: "Quadrant Chart",
    query: "Create a quadrant chart for technical debt prioritization based on code analysis. Plot issues by impact vs effort, using metrics like complexity, bug frequency, and development time estimates.",
    category: "Strategy"
  },
  {
    id: "mindmap",
    name: "Mindmap",
    query: "Generate a mindmap of the project structure showing the main modules, features, and their relationships. Organize by functional areas and technical components.",
    category: "Strategy"
  },
  {
    id: "requirement",
    name: "Requirement Diagram",
    query: "Based on Jira tickets, issues, and code comments, create a requirement diagram showing functional requirements, their relationships, and how they map to system components.",
    category: "Strategy"
  },

  // Technical
  {
    id: "gitgraph",
    name: "Gitgraph",
    query: "Create a Git graph showing the branching strategy and recent development flow. Include main branches, feature branches, merges, and release points from the repository history.",
    category: "Technical"
  },
  {
    id: "packet",
    name: "Packet",
    query: "Analyze network-related code and API specifications to create a packet diagram showing the structure of key data formats, API requests, or communication protocols used in the system.",
    category: "Technical"
  }
];


export function getDiagramQuery(diagramType: string): string | null {
  const query = diagramQueries.find(q => q.id === diagramType);
  return query ? query.query : null;
}
