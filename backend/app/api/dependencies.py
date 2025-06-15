from functools import lru_cache
from typing import AsyncGenerator
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.repositories.implementations import UserRepository, ChatRepository, DiagramRepository

@lru_cache()
def get_mongo_client() -> AsyncIOMotorClient:
    """Get MongoDB client instance."""
    return AsyncIOMotorClient(settings.MONGO_URI)

async def get_mongo_db() -> AsyncGenerator[AsyncIOMotorClient, None]:
    """Get MongoDB database dependency."""
    client = get_mongo_client()
    try:
        yield client
    finally:
        client.close()

def get_user_repository(client: AsyncIOMotorClient = get_mongo_client()) -> UserRepository:
    """Get UserRepository instance."""
    return UserRepository(client)

def get_chat_repository(client: AsyncIOMotorClient = get_mongo_client()) -> ChatRepository:
    """Get ChatRepository instance."""
    return ChatRepository(client)

def get_diagram_repository(client: AsyncIOMotorClient = get_mongo_client()) -> DiagramRepository:
    """Get DiagramRepository instance."""
    return DiagramRepository(client)