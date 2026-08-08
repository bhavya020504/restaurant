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
    allow_origin_regex=r"https://.*\.vercel\.app",
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
