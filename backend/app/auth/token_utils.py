"""
Utility functions for token extraction and user data processing
"""
from typing import Optional, Dict, Any
from fastapi import Request
from fastapi.security import HTTPAuthorizationCredentials

def get_token_from_cookie(request: Request) -> Optional[str]:
    """Extract NextAuth session token from cookies"""
    session_token = request.cookies.get("next-auth.session-token")
    if not session_token:
        session_token = request.cookies.get("__Secure-next-auth.session-token")
    return session_token

def get_token_from_header(request: Request) -> Optional[str]:
    """Extract JWT token from Authorization header"""
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]  # Remove "Bearer " prefix
    return None

def get_token_from_credentials(credentials: Optional[HTTPAuthorizationCredentials]) -> Optional[str]:
    """Extract JWT token from HTTPAuthorizationCredentials"""
    if credentials:
        return credentials.credentials
    return None

def extract_user_data_from_jwt(jwt_payload: Dict[str, Any]) -> Dict[str, Any]:
    """Extract standardized user data from JWT payload"""
    return {
        "user_id": jwt_payload.get('sub'),
        "email": jwt_payload.get('email'),
        "name": jwt_payload.get('name'),
        "image": jwt_payload.get('picture') or jwt_payload.get('image'),
    }

def extract_user_data_from_session(nextauth_user: Dict[str, Any]) -> Dict[str, Any]:
    """Extract standardized user data from NextAuth session user"""
    return {
        "user_id": str(nextauth_user['_id']),
        "email": nextauth_user.get('email'),
        "name": nextauth_user.get('name'),
        "image": nextauth_user.get('image'),
    }