from pydantic import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "CodeBuddy"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = False
    WORKERS: int = 1
    CORS_ORIGINS: list[str] = ["*"]
    REDIS_URL: str = "redis://localhost:6379/0"
    MONGO_URI: str = "mongodb://localhost:27017/"

    class Config:
        env_file = ".env"


settings = Settings()
