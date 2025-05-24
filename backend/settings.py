"""
Settings module.

This module contains the application settings.

Attributes:
    Settings {class} -- Application settings.
    settings {Settings} -- Application settings instance.
"""

import multiprocessing
from pathlib import Path
from tempfile import gettempdir
from typing import Tuple, Type

from pydantic import Field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
)
from yarl import URL

TEMP_DIR = Path(gettempdir())


class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    # Application bind settings
    application_name: str = Field("contingio-backend", alias="APPLICATION_NAME")
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
    cors_allow_origins: str = Field("*", alias="APPLICATION_CORS_ALLOW_ORIGINS")
    cors_allow_methods: str = Field("GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS", alias="APPLICATION_CORS_ALLOW_METHODS")
    cors_allow_headers: str = Field("*", alias="APPLICATION_CORS_ALLOW_HEADERS")

    # This variable is used to override
    # the workers count.
    workers_count_override: int | None = Field(None, alias="APPLICATION_UVICORN_WORKERS_COUNT")

    @property
    def workers_count(self) -> int:
        """
        Calculate workers count based on CPU cores.

        :return: workers count.
        """
        if self.workers_count_override is None or self.workers_count_override == 0:
            return (multiprocessing.cpu_count() * 2) + 1
        return self.workers_count_override
    
settings = Settings()