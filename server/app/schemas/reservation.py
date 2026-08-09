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

class AIReservationCheck(BaseModel):
    date: str
    time: str
    guests_count: int

class AIReservationCheckResponse(BaseModel):
    available: bool
    date: str
    time: str
    guests_count: int
    message: str

class AIReservationCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = "—"
    guests_count: int
    date: str
    time: str
    seating_preference: Optional[str] = "Indoor"
    special_request: Optional[str] = None
    idempotency_key: Optional[str] = None

class AIReservationResponse(BaseModel):
    success: bool = True
    reservation_id: str
    status: str
    date: str
    time: str
    guests_count: int
    message: str = "Reservation created successfully"

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
