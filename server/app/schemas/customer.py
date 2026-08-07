from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str
    avatar: Optional[str] = None

class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    avatar: Optional[str]
    joined_date: str
    total_orders: int
    total_spent: float
    is_vip: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
