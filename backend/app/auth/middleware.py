"""
Authentication middleware for NextAuth integration
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import logging

from .jwt_handler import jwt_handler
from .token_utils import (
    get_token_from_cookie, 
    get_token_from_header,
    extract_user_data_from_jwt,
    extract_user_data_from_session
)
from app.db.mongodb import get_mongo_client

logger = logging.getLogger(__name__)

# Paths that don't require authentication
PUBLIC_PATHS = {
    "/docs", "/redoc", "/openapi.json",
    "/health", 
    "/user/health", "/chat/health", "/tools/health", "/diagram/health",
}

# POST endpoints that are public (like user registration)
PUBLIC_POST_PATHS = {
    "/user/",  # User creation/registration
}

# Paths that require authentication
PROTECTED_PATH_PREFIXES = {
    "/chat",
    "/tools", 
    "/diagram",
    "/user",  # Except creation endpoint for POST
}

def is_public_path(path: str, method: str = "GET") -> bool:
    """Check if the path is public (doesn't require authentication)"""
    # Exact match for public paths
    if path in PUBLIC_PATHS:
        return True
    
    # Allow specific POST endpoints to be public
    if method == "POST" and path in PUBLIC_POST_PATHS:
        return True
        
    # Check if path starts with any protected prefix
    for prefix in PROTECTED_PATH_PREFIXES:
        if path.startswith(prefix):
            return False
    
    return True

async def auth_middleware(request: Request, call_next):
    """
    Authentication middleware that checks for valid NextAuth tokens
    """
    path = request.url.path
    method = request.method
    
    # Skip authentication for public paths
    if is_public_path(path, method):
        return await call_next(request)
    
    # Try to authenticate the request
    user_data = None
    auth_method = None
    
    # Try JWT token first
    jwt_token = get_token_from_header(request)
    if jwt_token:
        try:
            jwt_payload = jwt_handler.verify_jwt_token(jwt_token)
            if 'sub' in jwt_payload or 'email' in jwt_payload:
                user_data = extract_user_data_from_jwt(jwt_payload)
                auth_method = "jwt"
        except HTTPException:
            pass  # Continue to try session token
    
    # Try session token from cookies if JWT failed
    if not user_data:
        session_token = get_token_from_cookie(request)
        if session_token:
            try:
                mongo_client = get_mongo_client()
                session_data = jwt_handler.verify_session_token(session_token, mongo_client)
                nextauth_user = session_data['user']
                user_data = extract_user_data_from_session(nextauth_user)
                auth_method = "session"
            except HTTPException:
                pass
    
    # If no valid authentication found, return 401
    if not user_data:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "detail": "Authentication required",
                "code": "authentication_required"
            },
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Add user data to request state for use in route handlers
    # For demo purposes, override user_id to "123"
    user_data["user_id"] = "123"
    request.state.user = user_data
    request.state.auth_method = auth_method
    
    # Continue with the request
    response = await call_next(request)
    return response