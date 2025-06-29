"""
FastAPI dependencies for NextAuth authentication.

These dependencies work with the auth middleware that validates NextAuth sessions
and puts user data in request.state.user
"""
from typing import Annotated
from fastapi import Depends, HTTPException, status, Request

from app.models.user import User
from app.repositories.implementations import UserRepository
from app.api.dependencies import get_user_repository
from app.auth.utils import get_user_from_repository

async def get_current_user(
    request: Request,
    user_repo: Annotated[UserRepository, Depends(get_user_repository)]
) -> User:
    """
    Get current authenticated user from database.
    
    This dependency requires the user to be authenticated by auth_middleware first.
    The middleware validates the NextAuth session and sets request.state.user
    
    Returns:
        User: Full user object from database (auto-created if needed)
        
    Raises:
        HTTPException: If no authenticated user found
    """
    return await get_user_from_repository(request, user_repo)

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Dependency to ensure current user is active
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User: Active user
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return current_user