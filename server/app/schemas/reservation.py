from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ReservationCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    customer_email: str
    guests_count: int
    date: str
    time: str
    seating_preference: str = "Indoor"
    special_request: Optional[str] = None

class ReservationStatusUpdate(BaseModel):
    status: str

class ReservationResponse(BaseModel):
    id: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_phone: str
    customer_email: str
    guests_count: int
    date: str
    time: str
    seating_preference: str
    status: str
    special_request: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
