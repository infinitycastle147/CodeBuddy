"""
Settings module.

This module contains the application settings.

Attributes:
    Settings {class} -- Application settings.
    settings {Settings} -- Application settings instance.
"""

from cryptography.fernet import Fernet
from pathlib import Path
from tempfile import gettempdir
from typing import List, Union
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

TEMP_DIR = Path(gettempdir())

load_dotenv()
class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

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
    
    @property
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins as a list."""
        return self._parse_cors_setting(self.cors_allow_origins)
    
    @property
    def get_cors_methods(self) -> List[str]:
        """Get CORS methods as a list."""
        return self._parse_cors_setting(self.cors_allow_methods)
    
    @property
    def get_cors_headers(self) -> List[str]:
        """Get CORS headers as a list."""
        return self._parse_cors_setting(self.cors_allow_headers)

    # This variable is used to override
    # the workers count.
    workers_count_override: int | None = Field(None, alias="APPLICATION_UVICORN_WORKERS_COUNT")

    # MongoDB settings
    mongo_uri: str = Field("mongodb://localhost:27017", alias="APPLICATION_MONGO_URI")
    mongo_db: str = Field("CodeBuddy", alias="APPLICATION_MONGO_DB")
    
    # Redis settings
    redis_url: str = Field("redis://localhost:6379/0", alias="APPLICATION_REDIS_URL")
    
    # Encryption settings
    encryption_key: str = Field(Fernet.generate_key().decode(), alias="APPLICATION_ENCRYPTION_KEY")  # Generate a 32-byte Fernet key

    # Langfuse settings
    langfuse_secret_key: str = Field("", alias="LANGFUSE_SECRET_KEY")
    langfuse_public_key: str = Field("", alias="LANGFUSE_PUBLIC_KEY")
    langfuse_host: str = Field("https://cloud.langfuse.com", alias="LANGFUSE_HOST")
    langfuse_enabled: bool = Field(True, alias="LANGFUSE_ENABLED")
    
    # Optimized Langfuse tracing settings
    langfuse_tracing_level: str = Field("essential", alias="LANGFUSE_TRACING_LEVEL")  # essential, detailed, debug, disabled
    langfuse_sample_rate: float = Field(1.0, alias="LANGFUSE_SAMPLE_RATE")  # 0.0 to 1.0
    langfuse_track_costs: bool = Field(True, alias="LANGFUSE_TRACK_COSTS")
    langfuse_track_tokens: bool = Field(True, alias="LANGFUSE_TRACK_TOKENS")
    
    # NextAuth settings
    nextauth_secret: str = Field("", alias="NEXTAUTH_SECRET")
    nextauth_url: str = Field("http://localhost:3000", alias="NEXTAUTH_URL")
    
    # Embedding and Reranking Provider settings
    embedding_provider: str = Field("cohere", alias="EMBEDDING_PROVIDER")
    reranking_provider: str = Field("cohere", alias="RERANKING_PROVIDER")
    
    # Model settings
    embedding_model: str = Field("embed-v4.0", alias="EMBEDDING_MODEL")
    reranking_model: str = Field("rerank-v3.5", alias="RERANKING_MODEL")
    
    # Cohere settings
    cohere_api_key: str = Field("", alias="COHERE_API_KEY")
    cohere_embedding_model: str = Field("embed-english-v3.0", alias="COHERE_EMBEDDING_MODEL")
    cohere_reranking_model: str = Field("rerank-v3.5", alias="COHERE_RERANKING_MODEL")

    @property
    def workers_count(self) -> int:
        """
        Calculate workers count based on CPU cores.

        :return: workers count.
        """
        if self.workers_count_override is None or self.workers_count_override == 0:
            # Use single worker for production to avoid memory issues
            return 1
        return self.workers_count_override
    
settings = Settings()