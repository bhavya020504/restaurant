from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.session import get_db
from app.models.customer import Customer
from app.api.auth import get_optional_current_user
from app.schemas.reservation import ReservationResponse, ReservationCreate, ReservationStatusUpdate
from app.repositories.reservation_repository import ReservationRepository
from app.services.snapserve import trigger_reservation_confirmation

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
    
    # Trigger SnapServe Voice AI Reservation Confirmation Campaign POST-COMMIT
    trigger_reservation_confirmation(created_res, customer=current_user)
    
    return created_res

@router.patch("/{res_id}/status", response_model=ReservationResponse)
def update_reservation_status(res_id: str, status_in: ReservationStatusUpdate, db: Session = Depends(get_db)):
    repo = ReservationRepository(db)
    updated = repo.update_status(res_id, status_in.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return updated
