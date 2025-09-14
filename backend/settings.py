from cryptography.fernet import Fernet
from typing import Optional
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

    # CORS settings
    cors_allow_origins: str = Field("*", alias="APPLICATION_CORS_ALLOW_ORIGINS")
    cors_allow_methods: str =  Field("*", alias="APPLICATION_CORS_ALLOW_METHODS")
    cors_allow_headers: str =  Field("*", alias="APPLICATION_CORS_ALLOW_HEADERS")

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