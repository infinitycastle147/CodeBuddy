"""
Utility functions for processing NextAuth session data
"""
from typing import Dict, Any

def extract_user_data_from_session(nextauth_user: Dict[str, Any]) -> Dict[str, Any]:
    """Extract standardized user data from NextAuth session user"""
    return {
        "user_id": nextauth_user.get('user_id') or str(nextauth_user.get('_id', '')),
        "email": nextauth_user.get('email'),
        "name": nextauth_user.get('name'),
        "image": nextauth_user.get('image'),
    }