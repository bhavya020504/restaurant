from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.session import get_db
from app.models.customer import Customer
from app.api.auth import get_optional_current_user
from app.schemas.complaint import ComplaintResponse, ComplaintCreate, ComplaintStatusUpdate
from app.repositories.complaint_repository import ComplaintRepository

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.get("", response_model=List[ComplaintResponse])
@router.get("/", response_model=List[ComplaintResponse])
def get_complaints(status: Optional[str] = None, db: Session = Depends(get_db)):
    repo = ComplaintRepository(db)
    return repo.get_all(status=status)

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    cmp_in: ComplaintCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[Customer] = Depends(get_optional_current_user)
):
    repo = ComplaintRepository(db)
    return repo.create(cmp_in, current_user=current_user)

@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(complaint_id: str, status_in: ComplaintStatusUpdate, db: Session = Depends(get_db)):
    repo = ComplaintRepository(db)
    updated = repo.update_status(complaint_id, status_in.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Complaint ticket not found")
    return updated
