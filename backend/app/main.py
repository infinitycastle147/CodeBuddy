# Standard library imports
import uvicorn

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

def create_app() -> FastAPI:
    """
    Factory function to create and configure the FastAPI application.
    """
    app = FastAPI(
        title="CodeBuddy",
        description="CodeBuddy is a tool for developers to help them with their code.",
    )

    # Configure CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=True,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # Add credential decryption middleware
    app.middleware("http")(decrypt_credentials_middleware)

    # Include application routers
    app.include_router(tools_router)
    app.include_router(chat_router)
    app.include_router(diagram_router)
    app.include_router(user_router)

    # Add exception handlers
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request, exc):
        return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        return JSONResponse({"detail": exc.errors()}, status_code=422)

    return app


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
