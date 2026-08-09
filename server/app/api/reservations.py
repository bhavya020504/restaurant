from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.session import get_db
from app.config import settings
from app.models.customer import Customer
from app.api.auth import get_optional_current_user
from app.schemas.reservation import (
    ReservationResponse, 
    ReservationCreate, 
    ReservationStatusUpdate,
    AIReservationCheck,
    AIReservationCheckResponse,
    AIReservationCreate,
    AIReservationResponse
)
from app.repositories.reservation_repository import ReservationRepository
from app.services.snapserve import trigger_reservation_confirmation

logger = logging.getLogger("uvicorn")

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("", response_model=List[ReservationResponse])
@router.get("/", response_model=List[ReservationResponse])
def get_reservations(status: Optional[str] = None, db: Session = Depends(get_db)):
    repo = ReservationRepository(db)
    return repo.get_all(status=status)

@router.get("/{res_id}", response_model=ReservationResponse)
def get_reservation(res_id: str, db: Session = Depends(get_db)):
    repo = ReservationRepository(db)
    res = repo.get_by_id(res_id)
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return res

@router.post("", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
def create_reservation(
    res_in: ReservationCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[Customer] = Depends(get_optional_current_user)
):
    repo = ReservationRepository(db)
    created_res = repo.create(res_in, current_user=current_user)
    
    # Trigger SnapServe Voice AI Reservation Confirmation Campaign POST-COMMIT for Website Reservations (Agent 587)
    trigger_reservation_confirmation(created_res, customer=current_user)
    
    return created_res

@router.post("/ai-check-availability", response_model=AIReservationCheckResponse)
@router.post("/ai-check-availability/", response_model=AIReservationCheckResponse)
def ai_check_reservation_availability(
    check_in: AIReservationCheck,
    x_ai_secret_key: Optional[str] = Header(None, alias="X-AI-Secret-Key"),
    db: Session = Depends(get_db)
):
    """
    Secure endpoint for SnapServe Agent 588 (Call & Reserve Agent) to check real table availability
    in Neon PostgreSQL before promising a table to the caller.
    """
    configured_secret = (settings.AI_ORDER_SECRET_KEY or "").strip()
    provided_secret = (x_ai_secret_key or "").strip()

    if not configured_secret or not provided_secret or provided_secret != configured_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )

    if check_in.guests_count <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Number of guests must be at least 1"
        )

    repo = ReservationRepository(db)
    is_available = repo.check_availability(check_in.date, check_in.time, check_in.guests_count)

    msg = f"Table is available for {check_in.guests_count} guests on {check_in.date} at {check_in.time}." if is_available else f"Sorry, table is not available for {check_in.guests_count} guests on {check_in.date} at {check_in.time}."

    return AIReservationCheckResponse(
        available=is_available,
        date=check_in.date,
        time=check_in.time,
        guests_count=check_in.guests_count,
        message=msg
    )

@router.post("/ai-create", response_model=AIReservationResponse, status_code=status.HTTP_201_CREATED)
@router.post("/ai-create/", response_model=AIReservationResponse, status_code=status.HTTP_201_CREATED)
def create_ai_reservation(
    res_in: AIReservationCreate,
    x_ai_secret_key: Optional[str] = Header(None, alias="X-AI-Secret-Key"),
    db: Session = Depends(get_db)
):
    """
    Secure endpoint for SnapServe Agent 588 (Call & Reserve Agent) to create a NEW table reservation on behalf of a phone customer.
    Requires X-AI-Secret-Key header matching AI_ORDER_SECRET_KEY.
    Inserts into Neon PostgreSQL database. Agent 588 handles its own WhatsApp & Email confirmation directly.
    """
    configured_secret = (settings.AI_ORDER_SECRET_KEY or "").strip()
    provided_secret = (x_ai_secret_key or "").strip()

    if not configured_secret or not provided_secret or provided_secret != configured_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )

    if res_in.guests_count <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Number of guests must be at least 1"
        )

    repo = ReservationRepository(db)
    is_available = repo.check_availability(res_in.date, res_in.time, res_in.guests_count)
    if not is_available:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Requested slot on {res_in.date} at {res_in.time} is fully booked."
        )

    standard_res_in = ReservationCreate(
        customer_name=res_in.customer_name,
        customer_phone=res_in.customer_phone,
        customer_email=res_in.customer_email or "—",
        guests_count=res_in.guests_count,
        date=res_in.date,
        time=res_in.time,
        seating_preference=res_in.seating_preference or "Indoor",
        special_request=res_in.special_request
    )

    logger.info(f"AI Reservation creation request received for phone: '{res_in.customer_phone}'")
    created_res = repo.create(standard_res_in, current_user=None)
    logger.info(f"AI Reservation committed to PostgreSQL! Reservation ID: '{created_res.id}'")

    # Trigger post-commit notification dispatcher safely
    trigger_reservation_confirmation(created_res, db=db)

    return AIReservationResponse(
        success=True,
        reservation_id=created_res.id,
        status="Confirmed",
        date=created_res.date,
        time=created_res.time,
        guests_count=created_res.guests_count,
        message="Reservation created successfully"
    )

@router.patch("/{res_id}/status", response_model=ReservationResponse)
def update_reservation_status(res_id: str, status_in: ReservationStatusUpdate, db: Session = Depends(get_db)):
    repo = ReservationRepository(db)
    updated = repo.update_status(res_id, status_in.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return updated
