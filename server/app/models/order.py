from sqlalchemy import String, Float, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional
from app.base import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    customer_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    customer_email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    tax: Mapped[float] = mapped_column(Float, nullable=False)
    delivery_fee: Mapped[float] = mapped_column(Float, default=0.0)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="Preparing", index=True)
    order_date: Mapped[str] = mapped_column(String(20), nullable=False)
    order_time: Mapped[str] = mapped_column(String(20), nullable=False)
    estimated_delivery_time: Mapped[str] = mapped_column(String(20), nullable=False)
    delivery_address: Mapped[str] = mapped_column(Text, nullable=False)
    items_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    
    # Embedded Rating & Review Columns
    rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    review: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", backref="orders", lazy="joined")
