from pydantic import Field
from typing import List
from app.models.base import BaseModelWithId
from app.models.message import Message

class Chat(BaseModelWithId):
    """Represents a chat conversation with multiple messages."""
    user_id: str = Field(..., description="ID of the user who owns the chat")
    title: str = Field(default="New Chat", description="Title of the chat conversation")
    messages: List[Message] = Field(default_factory=list, description="List of messages in the chat")
    
    def add_message(self, role: str, content: str) -> Message:
        """Add a new message to the chat and return it."""
        message = Message(role=role, content=content)
        self.messages.append(message)
        return message
