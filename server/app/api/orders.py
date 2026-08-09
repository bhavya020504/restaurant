from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.session import get_db
from app.models.customer import Customer
from app.api.auth import get_optional_current_user
from app.schemas.order import OrderResponse, OrderCreate, OrderStatusUpdate, OrderReviewCreate
from app.repositories.order_repository import OrderRepository
from app.services.snapserve import trigger_order_confirmation

router = APIRouter(prefix="/orders", tags=["Orders"])

import logging

logger = logging.getLogger("uvicorn")

@router.get("", response_model=List[OrderResponse])
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

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: OrderCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[Customer] = Depends(get_optional_current_user)
):
    cust_id = current_user.id if current_user else "anonymous"
    logger.info(f"Order creation request received on backend for customer_id: '{cust_id}'")

    repo = OrderRepository(db)
    logger.info("Inserting order into Neon PostgreSQL...")
    created_order = repo.create(order_in, current_user=current_user)
    logger.info(f"Database order commit succeeded! Order ID: '{created_order.id}', Assigned customer_id: '{created_order.customer_id}'")
    
    # Trigger SnapServe Voice AI Campaign safely after PostgreSQL commit
    try:
        trigger_order_confirmation(created_order, customer=current_user, db=db)
    except Exception as e:
        logger.warning(f"SnapServe Voice AI campaign trigger error: {e}")

    return created_order

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
