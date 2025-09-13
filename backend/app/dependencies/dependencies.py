from typing import AsyncGenerator
from fastapi import Depends
from pymongo import MongoClient
from app.repositories.implementations import (
    UserRepository,
    ChatRepository,
    DiagramRepository,
)
from app.db.mongodb import get_mongo_client


async def get_mongo_db() -> AsyncGenerator[MongoClient, None]:
    """Get MongoDB database dependency for FastAPI dependency injection."""
    client = get_mongo_client()
    try:
        yield client
    finally:
        pass


def get_user_repository(
    client: MongoClient = Depends(get_mongo_client),
) -> UserRepository:
    """Get UserRepository instance."""
    return UserRepository(client)


def get_chat_repository(
    client: MongoClient = Depends(get_mongo_client),
) -> ChatRepository:
    """Get ChatRepository instance."""
    return ChatRepository(client)


def get_diagram_repository(
    client: MongoClient = Depends(get_mongo_client),
) -> DiagramRepository:
    """Get DiagramRepository instance."""
    return DiagramRepository(client)
