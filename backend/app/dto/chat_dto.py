from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class MessageDTO(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str = Field(..., description="The message content from the user")
    chat_id: Optional[str] = Field(None, description="Chat ID for existing conversations")

class CreateChatRequest(BaseModel):
    title: Optional[str] = Field("New Chat", description="Title of the new chat")
    initial_message: Optional[str] = Field(None, description="Initial message to start the chat")

class ChatResponse(BaseModel):
    id: str
    title: str
    messages: List[MessageDTO]
    created_at: datetime
    updated_at: datetime

class MessageResponse(BaseModel):
    role: str
    content: str
    timestamp: datetime