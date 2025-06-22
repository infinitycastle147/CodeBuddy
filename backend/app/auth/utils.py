"""
Authentication utilities for accessing user data from request state
"""
from fastapi import Request, HTTPException, status
from typing import Optional, Dict, Any
from app.models.user import User
from app.repositories.implementations import UserRepository

async def get_current_user_from_request(request: Request) -> Dict[str, Any]:
    """
    Get current user data from request state (set by auth middleware)
    
    Args:
        request: FastAPI request object
        
    Returns:
        Dict containing user data
        
    Raises:
        HTTPException: If no user data in request state
    """
    if not hasattr(request.state, 'user') or not request.state.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authenticated user found"
        )
    
    return request.state.user

async def get_user_from_repository(
    request: Request, 
    user_repo: UserRepository
) -> User:
    """
    Get User object from database using request state data
    
    Args:
        request: FastAPI request object
        user_repo: User repository instance
        
    Returns:
        User object from database
    """
    user_data = await get_current_user_from_request(request)
    
    # Try to find existing user by email
    existing_user = await user_repo.find_by_email(user_data["email"])
    
    if existing_user:
        # Update user information if needed
        update_needed = False
        updates = {}
        
        if existing_user.name != user_data.get("name"):
            updates["name"] = user_data.get("name")
            update_needed = True
            
        if existing_user.image != user_data.get("image"):
            updates["image"] = user_data.get("image")
            update_needed = True
        
        if update_needed:
            await user_repo.update(existing_user.id, updates)
            # Refresh user data
            existing_user = await user_repo.find_by_email(user_data["email"])
        
        return existing_user
    else:
        # Create new user from NextAuth data
        username = user_data["email"].split("@")[0]
        
        new_user_data = {
            "email": user_data["email"],
            "username": username,
            "name": user_data.get("name"),
            "image": user_data.get("image"),
            "provider": "nextauth",
            "provider_id": user_data.get("user_id"),
            "is_active": True
        }
        
        created_user = await user_repo.create(new_user_data)
        return User(**created_user)

def get_auth_method(request: Request) -> Optional[str]:
    """
    Get authentication method used (jwt or session)
    
    Args:
        request: FastAPI request object
        
    Returns:
        Authentication method string or None
    """
    return getattr(request.state, 'auth_method', None)