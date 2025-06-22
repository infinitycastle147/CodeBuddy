"""
FastAPI dependencies for NextAuth authentication
These work with the auth middleware that handles token verification
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
    Get current authenticated user from request state and database.
    
    This dependency assumes the user is already authenticated by middleware.
    The middleware puts user data in request.state.user
    
    Args:
        request: FastAPI request object with user data in state
        user_repo: User repository for database operations
        
    Returns:
        User: Full user object from database
        
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