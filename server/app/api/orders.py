from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from app.session import get_db
from app.config import settings
from app.models.customer import Customer
from app.api.auth import get_optional_current_user
from app.schemas.order import OrderResponse, OrderCreate, OrderStatusUpdate, OrderReviewCreate, AIOrderCreate, AIOrderResponse
from app.repositories.order_repository import OrderRepository
from app.repositories.food_repository import FoodRepository
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

@router.post("/ai-create", response_model=AIOrderResponse, status_code=status.HTTP_201_CREATED)
@router.post("/ai-create/", response_model=AIOrderResponse, status_code=status.HTTP_201_CREATED)
def create_ai_order(
    order_in: AIOrderCreate,
    x_ai_secret_key: Optional[str] = Header(None, alias="X-AI-Secret-Key"),
    db: Session = Depends(get_db)
):
    """
    Secure endpoint for SnapServe Agent 586 (Call & Order Agent) to create an order on behalf of a phone customer.
    Requires X-AI-Secret-Key header matching AI_ORDER_SECRET_KEY.
    Recalculates order totals server-side using database menu item prices.
    """
    # 1. Validate Secret Header
    configured_secret = (settings.AI_ORDER_SECRET_KEY or "").strip()
    provided_secret = (x_ai_secret_key or "").strip()

    if not configured_secret or not provided_secret or provided_secret != configured_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )

    # 2. Validate Items & Recalculate Prices Server-Side
    if not order_in.items or len(order_in.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Order must contain at least one item"
        )

    food_repo = FoodRepository(db)
    all_foods = food_repo.get_all()

    processed_items = []
    subtotal = 0.0

    for item in order_in.items:
        if item.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Item quantity must be greater than zero"
            )

        matched_food = None
        # Try matching by food_id
        if item.food_id:
            matched_food = food_repo.get_by_id(item.food_id)

        # Fallback matching by name
        if not matched_food and item.name:
            query_name = item.name.strip().lower()
            for f in all_foods:
                if f.name.strip().lower() == query_name or query_name in f.name.strip().lower():
                    matched_food = f
                    break

        if not matched_food:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Food item '{item.name or item.food_id}' not found in menu catalog"
            )

        unit_price = matched_food.price
        item_total = round(unit_price * item.quantity, 2)
        subtotal += item_total

        processed_items.append({
            "food_id": matched_food.id,
            "name": matched_food.name,
            "price": unit_price,
            "quantity": item.quantity,
            "customization": item.customization
        })

    subtotal = round(subtotal, 2)
    tax = round(subtotal * 0.10, 2)  # 10% tax rate
    delivery_fee = 0.0
    total_amount = round(subtotal + tax + delivery_fee, 2)

    # 3. Create Standard OrderCreate Schema
    standard_order_in = OrderCreate(
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_email=order_in.customer_email or "—",
        delivery_address=order_in.delivery_address,
        items=processed_items,
        subtotal=subtotal,
        tax=tax,
        delivery_fee=delivery_fee,
        total_amount=total_amount,
        payment_method=order_in.payment_method or "Cash on Delivery"
    )

    # 4. Insert into Neon PostgreSQL using OrderRepository
    repo = OrderRepository(db)
    logger.info(f"AI Order creation request received for phone: '{order_in.customer_phone}'")
    created_order = repo.create(standard_order_in, current_user=None)
    logger.info(f"AI Order committed to PostgreSQL! Order ID: '{created_order.id}'")

    # 5. Post-Commit Confirmation Trigger (Campaign 140 -> Agent 585)
    try:
        trigger_order_confirmation(created_order, customer=None, db=db)
    except Exception as e:
        logger.warning(f"SnapServe Voice AI campaign trigger warning: {e}")

    return AIOrderResponse(
        success=True,
        order_id=created_order.id,
        status="created",
        total_amount=created_order.total_amount,
        estimated_delivery_time=created_order.estimated_delivery_time,
        message="Order created successfully"
    )

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
