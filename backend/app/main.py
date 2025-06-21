"""
    Main module for CodeBuddy application.

    This module initializes the FastAPI application, configures middleware,
    includes routers, and sets up exception handling.
"""

# Standard library imports
import uvicorn

# Configure logging first
from app.core.logging import setup_logging

# Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Local application imports
from app.routers.tools_router import router as tools_router
from app.routers.chat_router import router as chat_router
from app.routers.diagram_router import router as diagram_router
from app.routers.user_router import router as user_router
from app.core.middleware import decrypt_credentials_middleware
from settings import settings
from loguru import logger


def create_app() -> FastAPI:
    """
    Factory function to create and configure the FastAPI application.
    """
    logger.info("Initializing CodeBuddy FastAPI application")
    
    app = FastAPI(
        title="CodeBuddy",
        description="CodeBuddy is a tool for developers to help them understand their code by generating diagrams and interacting with AI.",
        swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}},
    )

    # Configure CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.get_cors_origins,
        allow_credentials=True,
        allow_methods=settings.get_cors_methods,
        allow_headers=settings.get_cors_headers,
    )

    # Add credential decryption middleware
    app.middleware("http")(decrypt_credentials_middleware)

    # Include application routers
    logger.info("Including application routers")
    app.include_router(tools_router)
    app.include_router(chat_router)
    app.include_router(diagram_router)
    app.include_router(user_router)

    # Health check endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint for load balancers and monitoring."""
        return {"status": "healthy", "service": "CodeBuddy Backend"}

    # Add exception handlers
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc):
        logger.error(f"HTTP Exception: {exc.detail} - Status: {exc.status_code}")
        return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        logger.error(f"Validation Error: {exc.errors()}")
        return JSONResponse({"detail": exc.errors()}, status_code=422)

    logger.info("FastAPI application initialized successfully")
    return app

app = create_app()

# Entry point for running the application
if __name__ == "__main__":
    app = create_app()
    uvicorn.run(
        app,
        workers=settings.workers_count,
        factory=True,
        host=settings.host,
        port=settings.port,
    )
