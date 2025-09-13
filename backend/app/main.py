# Standard library imports
import uvicorn
from typing import Dict

# Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local application imports
from app.routers.setup_router import router as setup_router
from app.routers.chat_router import router as chat_router
from app.routers.diagram_router import router as diagram_router
from app.routers.user_router import router as user_router
from app.core.middleware import decrypt_credentials_middleware
from app.auth.middleware import auth_middleware
from settings import settings


def create_app() -> FastAPI:
    """Factory function to create and configure the FastAPI application. """

    codebuddy_app = FastAPI(
        title="CodeBuddy",
        description="CodeBuddy is a tool for developers to help them understand their code by generating diagrams and interacting with AI.",
        swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}},
    )

    # Configure CORS middleware
    codebuddy_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # Add credential decryption middleware
    codebuddy_app.middleware("http")(decrypt_credentials_middleware)
    
    # Add authentication middleware
    codebuddy_app.middleware("http")(auth_middleware)

    # Include application routers
    codebuddy_app.include_router(setup_router)
    codebuddy_app.include_router(chat_router)
    codebuddy_app.include_router(diagram_router)
    codebuddy_app.include_router(user_router)

    # Health check endpoint
    @codebuddy_app.get("/health")
    async def health_check() -> Dict[str, str]:
        """Health check endpoint for load balancers and monitoring."""
        return {"status": "healthy", "service": "CodeBuddy Backend"}

    return codebuddy_app

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
