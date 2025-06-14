from pydantic import BaseModel, Field
from app.models.base import BaseModelWithId

class Chat(BaseModelWithId):

    role: str = Field(..., description="Role of the chat participant (e.g., user, agent)")
    content: str = Field(..., description="Content of the chat message")
