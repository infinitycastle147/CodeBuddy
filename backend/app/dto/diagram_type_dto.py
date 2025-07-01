from pydantic import BaseModel, Field, validator
from app.constants.diagram_types import validate_diagram_type


class DiagramTypeDetectionRequest(BaseModel):
    user_input: str = Field(..., description="User input for detecting diagram type")


class DiagramTypeDetectionResponse(BaseModel):
    diagram_type: str = Field(..., description="Detected diagram type")
    
    @validator('diagram_type')
    def validate_diagram_type_field(cls, v):
        if not validate_diagram_type(v):
            raise ValueError(f"Invalid diagram type: {v}")
        return v