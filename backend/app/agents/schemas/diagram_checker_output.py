# Third-Party Imports
from pydantic import BaseModel, Field


class DiagramValidationOutput(BaseModel):
    """
    Simplified output schema for diagram_checker_agent that returns final validated diagrams.
    
    This agent performs internal validation and correction, outputting only the final
    corrected diagram and a content-focused explanation of what it represents.
    """
    
    diagram: str = Field(
        description="Final, corrected, and validated Mermaid diagram code guaranteed to work"
    )
    
    explanation: str = Field(
        description="Brief description of what the diagram shows and how it addresses the user's query"
    )