# Authentication and Authorization module for NextAuth JWT verification and resource access control

from .dependencies import get_current_user, get_current_active_user
from .authorization import (
    require_chat_ownership,
    require_diagram_ownership,
    require_same_user,
    get_user_chats,
    get_user_diagrams,
    AuthorizationError,
    ResourceNotFoundError,
)

__all__ = [
    "get_current_user",
    "get_current_active_user", 
    "require_chat_ownership",
    "require_diagram_ownership",
    "require_same_user",
    "get_user_chats",
    "get_user_diagrams",
    "AuthorizationError",
    "ResourceNotFoundError",
]