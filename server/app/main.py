import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.models import Base
from app.seed import seed_database
from app.api.router import api_router
from migrate_db_columns import apply_column_migrations

logger = logging.getLogger("uvicorn")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Context Manager.
    Logs target host safely with masked password, applies DDL column migrations, and initializes tables.
    """
    logger.info(f"Target Database Host: {settings.db_host}")
    logger.info(f"Connecting via URL: {settings.masked_db_url}")

    try:
        logger.info("Initializing Neon PostgreSQL database tables & applying schema migrations...")
        Base.metadata.create_all(bind=engine)
        apply_column_migrations()
        logger.info("Database tables & schema migrations initialized successfully!")
        seed_database()
    except Exception as e:
        logger.warning(f"Database initialization deferred for host '{settings.db_host}': {e}")
    yield

app = FastAPI(
    title="BR KITCHEN Restaurant Management API",
    description="Production Full-Stack FastAPI backend powered by Neon PostgreSQL & SQLAlchemy 2.0",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(api_router)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "service": "BR KITCHEN Backend API",
        "database_host": settings.db_host,
        "environment": settings.ENVIRONMENT
    }

@app.get("/debug-db", tags=["Health"])
def debug_db():
    import urllib.parse
    from sqlalchemy import text
    from app.config import ENV_FILE_PATH

    parsed = urllib.parse.urlparse(settings.export_db_url)
    query_params = urllib.parse.parse_qs(parsed.query)

    password = parsed.password or ""
    starts_with = password[:4] if len(password) >= 4 else password
    ends_with = password[-4:] if len(password) >= 4 else ""

    env_file_exists = os.path.exists(ENV_FILE_PATH)
    if "DATABASE_URL" in os.environ:
        source = "Render Environment"
    elif env_file_exists:
        source = "local .env file"
    else:
        source = "Default Fallback"

    db_test = "FAILED"
    conn_error = None

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT current_user, current_database();"))
            db_test = "SUCCESS"
    except Exception as e:
        conn_error = str(e)

    return {
        "database_host": parsed.hostname or settings.db_host,
        "database_name": parsed.path.lstrip("/"),
        "username": parsed.username or "unknown",
        "driver": parsed.scheme,
        "database_url_source": source,
        "password_length": len(password),
        "starts_with": starts_with,
        "ends_with": ends_with,
        "sslmode": query_params.get("sslmode", ["none"])[0],
        "channel_binding": query_params.get("channel_binding", ["none"])[0],
        "database_url_exists": bool(settings.DATABASE_URL),
        "env_file_exists": env_file_exists,
        "database_connection_test": db_test,
        "connection_error": conn_error
    }
