from sqlalchemy import String, Float, Boolean, Integer, ARRAY, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.base import Base

class Food(Base):
    __tablename__ = "foods"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.8)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    image: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    prep_time_minutes: Mapped[int] = mapped_column(Integer, default=15)
    calories: Mapped[int] = mapped_column(Integer, default=500)
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_veg: Mapped[bool] = mapped_column(Boolean, default=False)
    is_spicy: Mapped[bool] = mapped_column(Boolean, default=False)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True)
