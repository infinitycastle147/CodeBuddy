from fastapi import FastAPI
import uvicorn
from app.routers.tools_router import router as tools_router
from fastapi.middleware.cors import CORSMiddleware
from settings import settings

app = FastAPI(
    title="CodeBuddy",
    description="CodeBuddy is a tool for developers to help them with their code.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(tools_router)

if __name__ == "__main__":
    uvicorn.run(
        app,
        workers=settings.workers_count,
        factory=True,
        host=settings.host,
        port=settings.port,
    )
