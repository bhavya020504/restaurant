from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.session import get_db
from app.models.customer import Customer
from app.api.auth import get_optional_current_user
from app.schemas.order import OrderResponse, OrderCreate, OrderStatusUpdate, OrderReviewCreate
from app.repositories.order_repository import OrderRepository

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/", response_model=List[OrderResponse])
def get_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    repo = OrderRepository(db)
    return repo.get_all(status=status)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    repo = OrderRepository(db)
    order = repo.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[Customer] = Depends(get_optional_current_user)
):
    repo = OrderRepository(db)
    return repo.create(order_in, current_user=current_user)

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: str, status_in: OrderStatusUpdate, db: Session = Depends(get_db)):
    repo = OrderRepository(db)
    updated = repo.update_status(order_id, status_in.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated

@router.post("/{order_id}/review", response_model=OrderResponse)
def add_order_review(order_id: str, review_in: OrderReviewCreate, db: Session = Depends(get_db)):
    repo = OrderRepository(db)
    updated = repo.add_review(order_id, rating=review_in.rating, review=review_in.review)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated
