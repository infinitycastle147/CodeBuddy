from functools import lru_cache
from typing import AsyncGenerator, Annotated

from fastapi import Depends, Request
from pymongo import MongoClient

from app.repositories.implementations import (
    UserRepository,
    ChatRepository,
    DiagramRepository,
)
from app.db.mongodb import get_mongo_client
from app.models.user import User
from app.auth.utils import get_user_from_repository


async def get_mongo_db() -> AsyncGenerator[MongoClient, None]:
    """Get MongoDB database dependency for FastAPI dependency injection."""
    client = get_mongo_client()
    try:
        yield client
    finally:
        # We don't close the client here as it's a singleton
        # The connection will be returned to the pool
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


async def get_current_user(
    request: Request,
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> User:
    """
    Get current authenticated user from request state and database.
    This dependency should be used in route handlers that need the current user.
    
    Note: Authentication is handled by middleware, so this dependency 
    assumes the user is already authenticated.
    """
    return await get_user_from_repository(request, user_repo)
