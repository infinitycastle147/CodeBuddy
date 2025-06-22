"""
NextAuth JWT verification handler using PyJWT
"""
import jwt
from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import HTTPException, status
from pymongo import MongoClient
from bson import ObjectId
from settings import settings

class NextAuthJWTHandler:
    def __init__(self):
        self.secret = getattr(settings, 'nextauth_secret', None)
        if not self.secret:
            raise ValueError("NEXTAUTH_SECRET environment variable must be set")
        
        self.algorithm = "HS256"
        # Use existing MongoDB client from settings
        self.mongo_uri = settings.mongo_uri
        self.db_name = settings.mongo_db
        
    def verify_jwt_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode NextAuth JWT token"""
        try:
            # PyJWT automatically verifies expiration by default
            payload = jwt.decode(
                token, 
                self.secret, 
                algorithms=[self.algorithm]
            )
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    def verify_session_token(self, session_token: str, mongo_client: MongoClient) -> Dict[str, Any]:
        """Verify session token against MongoDB sessions collection"""
        try:
            db = mongo_client[self.db_name]
            
            # Query the sessions collection created by NextAuth
            session = db.sessions.find_one({
                "sessionToken": session_token
            })
            
            if not session:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session not found"
                )
            
            # Check if session is expired
            if session.get('expires') and session['expires'] < datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session has expired"
                )
            
            # Get user information from NextAuth users collection
            user = db.users.find_one({
                "_id": ObjectId(session['userId'])
            })
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found"
                )
            
            return {
                "user": user,
                "session": session
            }
            
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Session verification failed: {str(e)}"
            )

# Global JWT handler instance
jwt_handler = NextAuthJWTHandler()