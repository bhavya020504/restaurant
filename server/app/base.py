from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    SQLAlchemy 2.0 Base class for declarative ORM models.
    All database models inherit from this Base class.
    """
    pass
