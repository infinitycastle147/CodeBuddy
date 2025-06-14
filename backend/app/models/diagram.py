from pydantic import BaseModel, Field

from app.models.base import BaseModelWithId

class Diagram(BaseModelWithId):
    """
    Represents a diagram in the system.
    """

    title: str = Field(..., description="Title of the diagram")
    description: str = Field(..., description="Description of the diagram")
    content: str = Field(..., description="Content of the diagram in JSON format")
