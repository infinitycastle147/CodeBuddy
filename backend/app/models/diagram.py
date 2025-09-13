from pydantic import BaseModel, Field
from datetime import datetime

from app.models.base import BaseModelWithId

class Diagram(BaseModelWithId):
    """
    Represents a diagram in the system.
    """
    user_id: str = Field(..., description="ID of the user who owns the diagram")
    title: str = Field(..., description="Title of the diagram")
    type: str = Field(default="flowchart", description="Type of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in mermaid format")

