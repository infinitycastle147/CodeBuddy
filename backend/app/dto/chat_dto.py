from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MessageDTO(BaseModel):
    role: str = Field(..., description="Role of the message sender (e.g., user, assistant, system)")
    content: str = Field(..., description="Content of the message")
    timestamp: Optional[datetime] = Field(None, description="Timestamp when the message was created")

class ChatRequest(BaseModel):
    message: str = Field(..., description="The message content from the user")

class ChatResponse(BaseModel):
    id: str = Field(..., description="ID of the chat conversation")
    user_id: str = Field(..., description="ID of the user who owns the chat")
    title: str = Field(..., description="Title of the chat conversation")
    messages: List[MessageDTO] = Field(..., description="List of messages in the chat")

class MessageResponse(BaseModel):
    role: str = Field(..., description="Role of the message sender (e.g., user, assistant, system)")
    content: str = Field(..., description="Content of the message")
    timestamp: datetime = Field(..., description="Timestamp when the message was created")
