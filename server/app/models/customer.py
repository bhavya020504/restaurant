from sqlalchemy import String, Float, Integer, DateTime, Text, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.base import Base

class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=True)
    avatar: Mapped[str] = mapped_column(Text, nullable=True)
    joined_date: Mapped[str] = mapped_column(String(20), nullable=False)
    total_orders: Mapped[int] = mapped_column(Integer, default=0)
    total_spent: Mapped[float] = mapped_column(Float, default=0.0)
    is_vip: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
