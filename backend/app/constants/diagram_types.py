from enum import Enum


class DiagramType(Enum):
    """Supported diagram types"""
    
    FLOWCHART = "flowchart"
    SEQUENCE = "sequence"
    CLASS = "class"
    STATE = "state"
    ENTITY_RELATIONSHIP = "erd"
    USER_JOURNEY = "user_journey"
    GANTT = "gantt"
    PIE = "pie"
    QUADRANT_CHART = "quadrant_chart"
    REQUIREMENT = "requirement"
    GITGRAPH = "gitgraph"
    C4 = "c4"
    MINDMAP = "mindmap"
    TIMELINE = "timeline"
    ZENUML = "zenuml"
    SANKEY = "sankey"
    XY_CHART = "xy_chart"
    BLOCK = "block"
    PACKET = "packet"
    KANBAN = "kanban"
    ARCHITECTURE = "architecture"
    RADAR = "radar"

    @classmethod
    def from_string(cls, diagram_type: str) -> "DiagramType":
        """Convert a string to a DiagramType enum."""
        for dt in cls:
            if dt.value == diagram_type:
                return dt
        raise ValueError(f"Invalid diagram type: {diagram_type}")


# All valid diagram types
ALL_DIAGRAM_TYPES = {dt.value for dt in DiagramType}


def validate_diagram_type(diagram_type: str) -> bool:
    """Validate if the provided diagram type is supported"""
    return diagram_type in ALL_DIAGRAM_TYPES 