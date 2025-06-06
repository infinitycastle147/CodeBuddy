# Standard library imports
import uvicorn

# Third-party imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local application imports
from app.routers.tools_router import router as tools_router
from settings import settings

# Initialize FastAPI application
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

# Include application routers
app.include_router(tools_router)

# Entry point for running the application
if __name__ == "__main__":
    uvicorn.run(
        app,
        workers=settings.workers_count,
        factory=True,
        host=settings.host,
        port=settings.port,
    )
