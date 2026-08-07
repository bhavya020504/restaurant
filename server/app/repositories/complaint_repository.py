from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.complaint import Complaint
from app.models.customer import Customer
from app.schemas.complaint import ComplaintCreate
import random
from datetime import datetime

class ComplaintRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: Optional[str] = None) -> List[Complaint]:
        stmt = select(Complaint).order_by(Complaint.created_at.desc())
        if status and status != "All":
            stmt = stmt.where(Complaint.status == status)
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, complaint_id: str) -> Optional[Complaint]:
        stmt = select(Complaint).where(Complaint.id == complaint_id)
        return self.db.scalars(stmt).first()

    def create(self, cmp_in: ComplaintCreate, current_user: Optional[Customer] = None) -> Complaint:
        cmp_id = f"CMP-{random.randint(100, 999)}"
        date_str = datetime.now().strftime("%Y-%m-%d")

        # Auto-resolve customer_id
        customer_id = current_user.id if current_user else None
        if not customer_id and cmp_in.customer_phone:
            matched_cust = self.db.scalar(
                select(Customer).where(Customer.phone == cmp_in.customer_phone)
            )
            if matched_cust:
                customer_id = matched_cust.id

        db_cmp = Complaint(
            id=cmp_id,
            customer_id=customer_id,
            customer_name=cmp_in.customer_name,
            customer_phone=cmp_in.customer_phone,
            order_id=cmp_in.order_id,
            issue=cmp_in.issue,
            category=cmp_in.category,
            priority=cmp_in.priority,
            status="Pending",
            date=date_str
        )
        self.db.add(db_cmp)
        self.db.commit()
        self.db.refresh(db_cmp)
        return db_cmp

    def update_status(self, complaint_id: str, status: str) -> Optional[Complaint]:
        cmp = self.get_by_id(complaint_id)
        if not cmp:
            return None
        cmp.status = status
        self.db.commit()
        self.db.refresh(cmp)
        return cmp
