from typing import Annotated
from fastapi import Depends, Request

from app.models.user import User
from app.repositories.implementations import UserRepository
from app.dependencies.dependencies import get_user_repository

async def get_current_user(
    request: Request,
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> User:
    """Get current authenticated user from database."""
    user_data = request.state.user
    return await user_repo.find_by_email(user_data["email"])
