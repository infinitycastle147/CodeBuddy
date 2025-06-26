"""
Authorization utilities and decorators for resource access control
"""
from typing import Annotated, Optional, Callable, Any
from functools import wraps
from fastapi import Depends, HTTPException, status, Request
from app.models.user import User
from app.models.chat import Chat
from app.models.diagram import Diagram
from app.repositories.implementations import ChatRepository, DiagramRepository, UserRepository
from app.api.dependencies import get_chat_repository, get_diagram_repository, get_user_repository
from app.auth.dependencies import get_current_user


async def require_chat_ownership(
    chat_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    chat_repo: Annotated[ChatRepository, Depends(get_chat_repository)]
) -> Chat:
    """
    Dependency that verifies the current user owns the requested chat.
    
    Args:
        chat_id: ID of the chat to check
        current_user: Current authenticated user
        chat_repo: Chat repository instance
        
    Returns:
        Chat: The chat object if user owns it
        
    Raises:
        HTTPException: 404 if chat not found, 403 if user doesn't own it
    """
    chat = await chat_repo.find_by_id(chat_id)
    
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    if str(chat.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You don't own this chat"
        )
    
    return chat


async def require_diagram_ownership(
    diagram_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    diagram_repo: Annotated[DiagramRepository, Depends(get_diagram_repository)]
) -> Diagram:
    """
    Dependency that verifies the current user owns the requested diagram.
    
    Args:
        diagram_id: ID of the diagram to check
        current_user: Current authenticated user
        diagram_repo: Diagram repository instance
        
    Returns:
        Diagram: The diagram object if user owns it
        
    Raises:
        HTTPException: 404 if diagram not found, 403 if user doesn't own it
    """
    diagram = await diagram_repo.find_by_id(diagram_id)
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    if str(diagram.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You don't own this diagram"
        )
    
    return diagram


async def require_same_user(
    user_id: str,
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Dependency that verifies the requested user ID matches the current user.
    
    Args:
        user_id: ID of the user being accessed
        current_user: Current authenticated user
        
    Returns:
        User: The current user if IDs match
        
    Raises:
        HTTPException: 403 if user IDs don't match
    """
    if str(user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own user data"
        )
    
    return current_user


def require_owner_or_admin(check_admin: bool = False):
    """
    Decorator factory for resource ownership checking.
    
    Args:
        check_admin: Whether to allow admin users to bypass ownership check
        
    Returns:
        Decorator function
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # This is a placeholder for future admin role implementation
            # For now, only ownership checking is implemented
            return await func(*args, **kwargs)
        return wrapper
    return decorator


async def get_user_chats(
    current_user: Annotated[User, Depends(get_current_user)],
    chat_repo: Annotated[ChatRepository, Depends(get_chat_repository)]
) -> list[Chat]:
    """
    Get all chats belonging to the current user.
    
    Args:
        current_user: Current authenticated user
        chat_repo: Chat repository instance
        
    Returns:
        List of chats owned by the user
    """
    return await chat_repo.find_by_user_id(str(current_user.id))


async def get_user_diagrams(
    current_user: Annotated[User, Depends(get_current_user)],
    diagram_repo: Annotated[DiagramRepository, Depends(get_diagram_repository)]
) -> list[Diagram]:
    """
    Get all diagrams belonging to the current user.
    
    Args:
        current_user: Current authenticated user
        diagram_repo: Diagram repository instance
        
    Returns:
        List of diagrams owned by the user
    """
    return await diagram_repo.find_by_user_id(str(current_user.id))


class AuthorizationError(HTTPException):
    """Custom exception for authorization errors"""
    def __init__(self, detail: str = "Access denied"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )


class ResourceNotFoundError(HTTPException):
    """Custom exception for resource not found errors"""
    def __init__(self, resource_type: str = "Resource"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource_type} not found"
        )