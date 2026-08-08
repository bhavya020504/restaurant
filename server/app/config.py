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
    DATABASE_URL: str = ""
    SECRET_KEY: str = "super-secret-key-br-kitchen-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    ENABLE_SEED: bool = False  # Disabled by default; only seeds when explicitly enabled
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://restaurant-3d54.onrender.com"
    ]

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH if os.path.exists(ENV_FILE_PATH) else None,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def export_db_url(self) -> str:
        """
        Formats DATABASE_URL for SQLAlchemy 2.0 driver compatibility.
        Converts postgres:// or postgresql:// to postgresql+psycopg2:// if needed.
        Strips quotes, whitespace, and safely removes channel_binding query parameter
        using urllib.parse to ensure compatibility with Neon PgBouncer connection pooler.
        """
        raw_url = self.DATABASE_URL.strip().strip("'").strip('"')
        if not raw_url:
            return raw_url

        if raw_url.startswith("postgres://"):
            raw_url = raw_url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+"):
            raw_url = raw_url.replace("postgresql://", "postgresql+psycopg2://", 1)

        try:
            parsed = urllib.parse.urlparse(raw_url)
            query_params = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)

            # Safely remove channel_binding if present (case-insensitive check)
            keys_to_remove = [k for k in query_params if k.lower() == "channel_binding"]
            for k in keys_to_remove:
                del query_params[k]

            new_query = urllib.parse.urlencode(query_params, doseq=True)

            return urllib.parse.urlunparse((
                parsed.scheme,
                parsed.netloc,
                parsed.path,
                parsed.params,
                new_query,
                parsed.fragment
            ))
        except Exception:
            return raw_url

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
