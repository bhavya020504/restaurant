from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create SQLAlchemy 2.0 Engine connected to Neon PostgreSQL
# SSL pooling and reconnect settings configured for cloud database resilience
engine = create_engine(
    settings.export_db_url,
    pool_pre_ping=True,       # Verifies connection health before executing queries
    pool_size=10,             # Connection pool size
    max_overflow=20,          # Overflow connections permitted during peak load
    echo=(settings.ENVIRONMENT == "development")  # SQL logging in dev mode
)

# SessionFactory using sessionmaker
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
