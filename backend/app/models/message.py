from pydantic import BaseModel, Field
from datetime import datetime

class Message(BaseModel):
    """Represents a single message in a chat conversation."""
    role: str = Field(..., description="Role of the message sender (e.g., user, assistant, system)")
    content: str = Field(..., description="Content of the message")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the message was created")
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}