"""
Application configuration and settings
"""
import json
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/todoapp"

    # JWT Settings
    JWT_SECRET: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"

    # Dapr
    DAPR_HTTP_PORT: int = 3500

    # CORS - stored as string, parsed via property
    CORS_ORIGINS_STR: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Parse CORS origins from string"""
        v = self.CORS_ORIGINS_STR.strip()
        # Try JSON first
        if v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Handle malformed JSON like [https://...] without quotes
                inner = v[1:-1] if v.endswith("]") else v[1:]
                return [origin.strip().strip('"\'') for origin in inner.split(",") if origin.strip()]
        # Comma-separated string
        return [origin.strip() for origin in v.split(",") if origin.strip()]

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
