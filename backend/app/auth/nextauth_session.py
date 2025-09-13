"""
NextAuth session validation handler
"""

import httpx
from typing import Dict, Any
from fastapi import HTTPException, status, Request
from loguru import logger
from settings import settings


class NextAuthSessionHandler:
    def __init__(self) -> None:
        self.base_url = settings.nextauth_url.rstrip("/")
        self.session_endpoint = f"{self.base_url}/api/auth/session"
        logger.info(f"NextAuth configured at: {self.base_url}")

    async def validate_session(self, request: Request) -> Dict[str, Any]:
        """Validate NextAuth session by forwarding request cookies."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    self.session_endpoint,
                    cookies=request.cookies,
                )
        except httpx.RequestError as e:
            logger.error(f"NextAuth connection error: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authentication service unavailable",
            )

        if response.status_code != 200:
            logger.error(f"NextAuth returned {response.status_code}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session validation failed",
            )

        session_data = response.json()
        user = session_data.get("user")

        if not user:
            logger.warning("No active NextAuth session found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No active session",
            )

        logger.info(f"Session validated for user: {user.get('email', 'unknown')}")
        return session_data


# Singleton instance for reuse
session_handler = NextAuthSessionHandler()
