from sqlalchemy import String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.base import Base

class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String(50), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(100), nullable=False)
    guests_count: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[str] = mapped_column(String(20), nullable=False)
    time: Mapped[str] = mapped_column(String(20), nullable=False)
    seating_preference: Mapped[str] = mapped_column(String(50), default="Indoor")
    status: Mapped[str] = mapped_column(String(30), default="Pending", index=True)
    special_request: Mapped[str] = mapped_column(Text, nullable=True)
    whatsapp_status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=True)
    email_status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=True)
    whatsapp_dispatched_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    email_dispatched_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", backref="reservations", lazy="joined")
