from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    order_id: str
    issue: str
    category: str = "Food Quality"
    priority: str = "Medium"

class ComplaintStatusUpdate(BaseModel):
    status: str

class ComplaintResponse(BaseModel):
    id: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    order_id: str
    issue: str
    category: str
    priority: str
    status: str
    date: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
