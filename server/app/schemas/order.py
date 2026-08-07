from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Any
from datetime import datetime

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = "—"
    delivery_address: str
    items: List[Any]
    subtotal: float
    tax: float
    delivery_fee: float = 0.0
    total_amount: float
    payment_method: str = "Credit Card"

class OrderStatusUpdate(BaseModel):
    status: str

class OrderReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    review: str

class OrderResponse(BaseModel):
    id: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    subtotal: float
    tax: float
    delivery_fee: float
    total_amount: float
    status: str
    order_date: str
    order_time: str
    estimated_delivery_time: str
    delivery_address: str
    items_json: Any
    rating: Optional[int] = None
    review: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
