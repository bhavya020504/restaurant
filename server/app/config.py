import os
import urllib.parse
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

# Compute absolute path to server/ directory so .env is ALWAYS found
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_FILE_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    """
    Pydantic Settings class loading environment variables from server/.env.
    Uses absolute file path resolution to ensure deterministic .env loading.
    """
    DATABASE_URL: str = "postgresql://neondb_owner:npg_placeholder@ep-cool-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
    SECRET_KEY: str = "super-secret-key-br-kitchen-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    ENABLE_SEED: bool = False  # Disabled by default; only seeds when explicitly enabled
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def export_db_url(self) -> str:
        """
        Formats DATABASE_URL for SQLAlchemy 2.0 driver compatibility.
        Converts postgres:// or postgresql:// to postgresql+psycopg2:// if needed.
        """
        url = self.DATABASE_URL.strip()
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
        return url

    @property
    def masked_db_url(self) -> str:
        """
        Returns a masked version of export_db_url replacing password with ********.
        Safe for logging and debugging without exposing secrets.
        """
        try:
            url = self.export_db_url
            parsed = urllib.parse.urlparse(url)
            if parsed.password:
                return url.replace(parsed.password, "********")
            return url
        except Exception:
            return "postgresql+psycopg2://<user>:********@<host>/<dbname>"

    @property
    def db_host(self) -> str:
        """Returns only the database host domain without credentials."""
        try:
            parsed = urllib.parse.urlparse(self.export_db_url)
            return parsed.hostname or "unknown-host"
        except Exception:
            return "unknown-host"

settings = Settings()
