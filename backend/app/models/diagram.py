from pydantic import BaseModel, Field
from datetime import datetime

from app.models.base import BaseModelWithId

class Diagram(BaseModelWithId):
    """
    Represents a diagram in the system.
    """
    user_id: str = Field(..., description="ID of the user who owns the diagram")
    title: str = Field(..., description="Title of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in mermaid format")

class DiagramResponse(BaseModel):
    """
    Response model for diagram endpoints.
    """
    id: str = Field(..., description="ID of the diagram")
    user_id: str = Field(..., description="ID of the user who owns the diagram")
    title: str = Field(..., description="Title of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in mermaid format")
    created_at: datetime = Field(..., description="Creation timestamp of the diagram")
    updated_at: datetime = Field(..., description="Last update timestamp of the diagram")
    
    class Config:
        orm_mode = True
