from motor.motor_asyncio import AsyncIOMotorClient
from app.models.user import User
from app.models.chat import Chat
from app.models.diagram import Diagram
from .base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, mongo_client: AsyncIOMotorClient):
        super().__init__(mongo_client, "codebuddy", "users")
        self.model_class = User

    async def find_by_email(self, email: str) -> User | None:
        """Find a user by email address."""
        document = await self.collection.find_one({"email": email})
        return User(**document) if document else None

class ChatRepository(BaseRepository[Chat]):
    def __init__(self, mongo_client: AsyncIOMotorClient):
        super().__init__(mongo_client, "codebuddy", "chats")
        self.model_class = Chat

    async def find_by_title(self, title: str) -> list[Chat]:
        """Find all chats by title."""
        cursor = self.collection.find({"title": title})
        documents = await cursor.to_list(length=None)
        return [Chat(**doc) for doc in documents]
        
    async def add_message_to_chat(self, chat_id: str, role: str, content: str) -> Chat:
        """Add a message to an existing chat."""
        # Get the chat
        chat = await self.find_by_id(chat_id)
        if not chat:
            return None
            
        # Add the message
        chat.add_message(role, content)
        
        # Update the chat in the database
        await self.update(chat_id, chat.dict(by_alias=True))
        
        return chat

class DiagramRepository(BaseRepository[Diagram]):
    def __init__(self, mongo_client: AsyncIOMotorClient):
        super().__init__(mongo_client, "codebuddy", "diagrams")
        self.model_class = Diagram

    async def find_by_title(self, title: str) -> Diagram | None:
        """Find a diagram by its title."""
        document = await self.collection.find_one({"title": title})
        return Diagram(**document) if document else None