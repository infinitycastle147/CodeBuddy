from pydantic import BaseSettings
from typing import List
import secrets


class Settings(BaseSettings):
    APP_NAME: str = "CodeBuddy"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = False
    WORKERS: int = 1
    
    # Database settings
    REDIS_URL: str = "redis://localhost:6379/0"
    MONGO_URI: str = "mongodb://localhost:27017/"
    
    # Encryption settings
    ENCRYPTION_KEY: str = secrets.token_urlsafe(32)  # Generate a random key on startup
    
    # CORS settings
    cors_allow_origins: List[str] = ["*"]
    cors_allow_methods: List[str] = ["*"]
    cors_allow_headers: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
