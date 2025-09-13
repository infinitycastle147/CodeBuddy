"""
Authentication middleware for NextAuth integration
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from loguru import logger

from .nextauth_session import session_handler
from .token_utils import extract_user_data_from_session

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
    
    # Skip authentication for OPTIONS requests (CORS preflight)
    if method == "OPTIONS":
        return True
        
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
    Authentication middleware that validates NextAuth sessions.
    
    For protected routes, this middleware:
    1. Calls NextAuth API to validate session cookies
    2. Extracts user data from session
    3. Sets request.state.user for downstream dependencies
    4. Returns 401 if authentication fails
    """

    path = request.url.path
    method = request.method

    # Skip authentication for public paths
    if is_public_path(path, method):
        return await call_next(request)
    
    # Authenticate user by validating NextAuth session
    user_data = None
    auth_method = None
    
    try:
        # Call NextAuth API to validate session
        session_data = await session_handler.validate_session(request)
        nextauth_user = session_data.get('user', {})
        
        # Extract standardized user data from NextAuth session
        user_data = extract_user_data_from_session(nextauth_user)
        auth_method = "nextauth_session"
        logger.info(f"User authenticated: {user_data.get('email', 'unknown')}")
        
    except HTTPException as e:
        logger.error(f"Session validation failed: {e.detail}")
    except Exception as e:
        logger.error(f"Unexpected error during session validation: {str(e)}")
                
    # If no valid authentication found, return 401
    if not user_data:
        logger.warning(f"Authentication failed for {method} {path}")
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "detail": "Authentication required",
                "code": "authentication_required"
            },
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Add user data to request state for use in route handlers
    request.state.user = user_data
    request.state.auth_method = auth_method
    logger.info(f"Authentication successful, proceeding with request")
    
    # Continue with the request
    response = await call_next(request)
    logger.debug(f"Request completed with status: {response.status_code}")
    return response