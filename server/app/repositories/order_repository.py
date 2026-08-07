from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.order import Order
from app.models.customer import Customer
from app.schemas.order import OrderCreate
import random
from datetime import datetime

class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: Optional[str] = None) -> List[Order]:
        stmt = select(Order).order_by(Order.created_at.desc())
        if status and status != "All":
            stmt = stmt.where(Order.status == status)
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, order_id: str) -> Optional[Order]:
        stmt = select(Order).where(Order.id == order_id)
        return self.db.scalars(stmt).first()

    def create(self, order_in: OrderCreate, current_user: Optional[Customer] = None) -> Order:
        order_id = f"BR-{random.randint(1000, 9999)}"
        now = datetime.now()
        date_str = now.strftime("%Y-%m-%d")
        time_str = now.strftime("%I:%M %p")
        est_time = now.strftime("%I:%M %p")

        # 1. Primary resolution: Use authenticated current_user from JWT token
        customer_id = current_user.id if current_user else None
        target_customer = current_user

        # 2. Fallback resolution: Lookup Customer by email if JWT token not provided
        if not customer_id and order_in.customer_email and order_in.customer_email != "—":
            matched_cust = self.db.scalar(
                select(Customer).where(Customer.email == order_in.customer_email.lower())
            )
            if matched_cust:
                customer_id = matched_cust.id
                target_customer = matched_cust

        # 3. Fallback resolution: Lookup Customer by phone if still unresolved
        if not customer_id and order_in.customer_phone and order_in.customer_phone != "—":
            matched_cust = self.db.scalar(
                select(Customer).where(Customer.phone == order_in.customer_phone)
            )
            if matched_cust:
                customer_id = matched_cust.id
                target_customer = matched_cust

        # Update customer statistics when customer is resolved
        if target_customer:
            target_customer.total_orders += 1
            target_customer.total_spent += order_in.total_amount

        db_order = Order(
            id=order_id,
            customer_id=customer_id,
            customer_name=order_in.customer_name,
            customer_phone=order_in.customer_phone,
            customer_email=order_in.customer_email,
            subtotal=order_in.subtotal,
            tax=order_in.tax,
            delivery_fee=order_in.delivery_fee,
            total_amount=order_in.total_amount,
            status="Preparing",
            order_date=date_str,
            order_time=time_str,
            estimated_delivery_time=est_time,
            delivery_address=order_in.delivery_address,
            items_json=order_in.items
        )
        self.db.add(db_order)
        self.db.commit()
        self.db.refresh(db_order)
        return db_order

    def update_status(self, order_id: str, status: str) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order:
            return None
        order.status = status
        self.db.commit()
        self.db.refresh(order)
        return order

    def add_review(self, order_id: str, rating: int, review: str) -> Optional[Order]:
        order = self.get_by_id(order_id)
        if not order:
            return None
        order.rating = rating
        order.review = review
        order.reviewed_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(order)
        return order
