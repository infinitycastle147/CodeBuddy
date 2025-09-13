from cryptography.fernet import Fernet
from typing import List, Union, Optional
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""

    # Application bind settings
    application_name: str = Field("CodeBuddy", alias="APPLICATION_NAME")
    host: str = Field("0.0.0.0", alias="APPLICATION_HOST")
    port: int = Field(8000, alias="APPLICATION_PORT")

    # Uvicorn settings
    timeout: int = Field(120, alias="APPLICATION_UVICORN_TIMEOUT")
    graceful_timeout: int = Field(30, alias="APPLICATION_UVICORN_GRACEFUL_TIMEOUT")
    keep_alive: int = Field(2, alias="APPLICATION_UVICORN_KEEP_ALIVE")
    reload: bool = Field(False, alias="APPLICATION_AUTO_RELOAD")

    # Current environment
    environment: str = Field("dev", alias="APPLICATION_ENVIRONMENT")

    # CORS settings
    cors_allow_origins: Union[List[str], str] = Field(["*"], alias="APPLICATION_CORS_ALLOW_ORIGINS")
    cors_allow_methods: Union[List[str], str] = Field(["*"], alias="APPLICATION_CORS_ALLOW_METHODS")
    cors_allow_headers: Union[List[str], str] = Field(["*"], alias="APPLICATION_CORS_ALLOW_HEADERS")
    
    def _parse_cors_setting(self, value: Union[List[str], str]) -> List[str]:
        """Parse CORS setting to ensure it's always a list."""
        if isinstance(value, str):
            if value == "*":
                return ["*"]
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    # This variable is used to override the workers count.
    workers_count_override: Optional[int] = Field(None, alias="APPLICATION_UVICORN_WORKERS_COUNT")

    # MongoDB settings
    mongo_uri: str = Field("mongodb://localhost:27017", alias="APPLICATION_MONGO_URI")
    mongo_db: str = Field("CodeBuddy", alias="APPLICATION_MONGO_DB")
    
    # Redis settings
    redis_url: str = Field("redis://localhost:6379/0", alias="APPLICATION_REDIS_URL")
    
    # Encryption settings
    encryption_key: str = Field(Fernet.generate_key().decode(), alias="APPLICATION_ENCRYPTION_KEY")  # Generate a 32-byte Fernet key
    
    # NextAuth settings
    nextauth_secret: str = Field("", alias="NEXTAUTH_SECRET")
    nextauth_url: str = Field("http://localhost:3000", alias="NEXTAUTH_URL")  # Set to frontend URL in production

    # Cohere settings
    cohere_api_key: str = Field("", alias="COHERE_API_KEY")

    workers_count: int = Field(1, alias="APPLICATION_WORKERS_COUNT")
    
settings = Settings()