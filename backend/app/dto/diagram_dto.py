from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DiagramRequest(BaseModel):
    user_input: str = Field(..., description="User input for generating the diagram")
    title: Optional[str] = Field(None, description="Title of the diagram")
    description: Optional[str] = Field(None, description="Description of the diagram")

class DiagramResponse(BaseModel):
    id: str
    title: str
    description: str
    content: str
    created_at: datetime
    updated_at: datetime