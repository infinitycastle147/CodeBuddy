from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DiagramRequest(BaseModel):
    user_input: str = Field(..., description="User input for generating the diagram")
    title: Optional[str] = Field(None, description="Title of the diagram")
    description: Optional[str] = Field(None, description="Description of the diagram")

class DiagramResponse(BaseModel):
    id: str = Field(..., description="ID of the diagram")
    user_id: str = Field(..., description="ID of the user who owns the diagram")
    title: str = Field(..., description="Title of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in mermaid format")
    created_at: datetime = Field(..., description="Creation timestamp of the diagram")
    updated_at: datetime = Field(..., description="Last update timestamp of the diagram")
