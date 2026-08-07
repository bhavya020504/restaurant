from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate
import uuid
from datetime import datetime

class CustomerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Customer]:
        stmt = select(Customer).order_by(Customer.created_at.desc())
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, customer_id: str) -> Optional[Customer]:
        stmt = select(Customer).where(Customer.id == customer_id)
        return self.db.scalars(stmt).first()

    def create(self, customer_in: CustomerCreate) -> Customer:
        customer_id = f"cust-{uuid.uuid4().hex[:8]}"
        date_str = datetime.now().strftime("%Y-%m-%d")
        db_customer = Customer(
            id=customer_id,
            name=customer_in.name,
            email=customer_in.email,
            phone=customer_in.phone,
            avatar=customer_in.avatar,
            joined_date=date_str,
            total_orders=0,
            total_spent=0.0
        )
        self.db.add(db_customer)
        self.db.commit()
        self.db.refresh(db_customer)
        return db_customer
