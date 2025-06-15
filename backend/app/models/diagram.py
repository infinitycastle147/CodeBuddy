from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.models.base import BaseModelWithId

class Diagram(BaseModelWithId):
    """
    Represents a diagram in the system.
    """

    title: str = Field(..., description="Title of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in mermaid format")

class DiagramResponse(BaseModel):
    """
    Response model for diagram endpoints.
    """
    id: str
    title: str
    description: str
    content: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
