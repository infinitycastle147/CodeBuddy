from pydantic import BaseModel

class DiagramRequest(BaseModel):
    query: str


class DiagramResponse(BaseModel):
    diagram_mermaid: str