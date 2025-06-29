"""
NextAuth session validation handler
"""
import httpx
from typing import Dict, Any, Optional
from fastapi import HTTPException, status, Request
from settings import settings
from loguru import logger

class NextAuthSessionHandler:
    def __init__(self):
        # Frontend NextAuth session endpoint
        self.nextauth_url = getattr(settings, 'nextauth_url', 'http://localhost:3000')
        self.session_endpoint = f"{self.nextauth_url}/api/auth/session"
        
    async def validate_session(self, request: Request) -> Dict[str, Any]:
        """Validate session by calling NextAuth session endpoint"""
        try:
            # Extract cookies from the request
            cookies = request.cookies
            logger.info(f"Validating session with NextAuth at {self.session_endpoint}")
            
            # Forward cookies to NextAuth session endpoint
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.session_endpoint,
                    cookies=cookies,
                    timeout=10.0
                )
                
            if response.status_code == 200:
                session_data = response.json()
                
                # Check if session exists
                if session_data and 'user' in session_data:
                    logger.info(f"Session validation successful for user: {session_data.get('user', {}).get('email', 'unknown')}")
                    return session_data
                else:
                    logger.warning("No active session found")
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="No active session"
                    )
            else:
                logger.error(f"Session validation failed with status: {response.status_code}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session validation failed"
                )
                
        except httpx.RequestError as e:
            logger.error(f"Failed to connect to NextAuth: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authentication service unavailable"
            )
        except Exception as e:
            logger.error(f"Session validation error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session validation failed"
            )

# Global session handler instance
session_handler = NextAuthSessionHandler()