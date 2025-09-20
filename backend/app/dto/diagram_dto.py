from pydantic import BaseModel, Field, validator
from typing import Optional
from app.dto.connection_dto import BaseMCPConnectionRequest
from app.constants.diagram_types import validate_diagram_type
from app.models import BaseModelWithId


class DiagramRequest(BaseMCPConnectionRequest):
    user_input: str = Field(..., description="User input for generating the diagram")
    title: Optional[str] = Field(None, description="Title of the diagram")
    type: str = Field(..., description="Type of the diagram")
    description: Optional[str] = Field(None, description="Description of the diagram")
    
    @validator('type')
    def validate_diagram_type_field(cls, v):
        if not validate_diagram_type(v):
            raise ValueError(f"Invalid diagram type: {v}")
        return v

class DiagramUpdateRequest(BaseModel):
    content: str = Field(..., description="Updated Content of the diagram in mermaid format")

class DiagramResponse(BaseModelWithId):
    user_id: str = Field(..., description="ID of the user who owns the diagram")
    title: str = Field(..., description="Title of the diagram")
    type: str = Field(..., description="Type of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in mermaid format")

class DiagramOutputFormat(BaseModel):
    diagram: str = Field(..., description="Diagram output format")
