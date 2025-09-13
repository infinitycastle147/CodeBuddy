from typing import Optional

from pymongo import MongoClient
from app.models.user import User
from app.models.chat import Chat
from app.models.diagram import Diagram
from settings import settings
from base import BaseRepository
from app.db.mongodb import async_find_one, async_find

db_name = settings.mongo_db

#############################################################
# User Repository
#############################################################

class UserRepository(BaseRepository[User]):

    def __init__(self, mongo_client: MongoClient):
        super().__init__(mongo_client, db_name, "users")
        self.model_class = User

    async def find_by_email(self, email: str) -> Optional[User]:
        """Find a user by email address."""
        document = await async_find_one(self.collection, {"email": email})
        return User(**document) if document else None

#############################################################
# Chat Repository
#############################################################

class ChatRepository(BaseRepository[Chat]):

    def __init__(self, mongo_client: MongoClient):
        super().__init__(mongo_client, db_name, "chats")
        self.model_class = Chat
    
    async def find_by_user_id(self, user_id: str) -> list[Chat]:
        """Find all chats by user ID."""
        documents = await async_find(self.collection, {"user_id": user_id})
        return [Chat(**doc) for doc in documents]
        
    async def add_message_to_chat(self, chat_id: str, role: str, content: str) -> Chat:
        """Add a message to an existing chat."""
        # Get the chat
        chat = await self.find_by_id(chat_id)
        if not chat:
            return None
            
        # Add the message
        chat.add_message(role, content)
        
        # Update the chat in the database using the model instance
        updated_chat = await self.update(chat_id, chat)
        
        return updated_chat

#############################################################
# Diagram Repository
#############################################################

class DiagramRepository(BaseRepository[Diagram]):

    def __init__(self, mongo_client: MongoClient):
        super().__init__(mongo_client, db_name, "diagrams")
        self.model_class = Diagram
    
    async def find_by_user_id(self, user_id: str) -> list[Diagram]:
        """Find all diagrams by user ID."""
        documents = await async_find(self.collection, {"user_id": user_id})
        return [Diagram(**doc) for doc in documents]
