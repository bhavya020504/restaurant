from typing import Generator
from sqlalchemy.orm import Session
from app.database import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI Dependency Injection generator.
    Yields a database Session instance per HTTP request and ensures clean closure.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
