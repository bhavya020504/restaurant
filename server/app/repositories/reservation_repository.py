from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.reservation import Reservation
from app.models.customer import Customer
from app.schemas.reservation import ReservationCreate
import random

class ReservationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, status: Optional[str] = None) -> List[Reservation]:
        stmt = select(Reservation).order_by(Reservation.created_at.desc())
        if status and status != "All":
            stmt = stmt.where(Reservation.status == status)
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, res_id: str) -> Optional[Reservation]:
        stmt = select(Reservation).where(Reservation.id == res_id)
        return self.db.scalars(stmt).first()

    def check_availability(self, date: str, time: str, guests_count: int) -> bool:
        """
        Checks table availability in Neon PostgreSQL for a specific date, time, and guest count.
        Max seating capacity per time slot standard is 40 guests total.
        """
        stmt = select(Reservation).where(
            Reservation.date == date,
            Reservation.time == time,
            Reservation.status != "Cancelled"
        )
        existing_res = list(self.db.scalars(stmt).all())
        total_booked_guests = sum(r.guests_count for r in existing_res)
        
        # Max capacity per slot: 40 guests
        return (total_booked_guests + guests_count) <= 40

    def create(self, res_in: ReservationCreate, current_user: Optional[Customer] = None) -> Reservation:
        res_id = None
        for _ in range(10):
            candidate_id = f"RES-{random.randint(300, 999)}"
            if not self.get_by_id(candidate_id):
                res_id = candidate_id
                break
        if not res_id:
            res_id = f"RES-{random.randint(1000, 9999)}"
        
        # 1. Primary resolution: Use authenticated current_user from JWT token
        customer_id = current_user.id if current_user else None

        # 2. Fallback resolution: Lookup Customer by email if JWT token not provided
        if not customer_id and res_in.customer_email:
            matched_cust = self.db.scalar(
                select(Customer).where(Customer.email == res_in.customer_email.lower())
            )
            if matched_cust:
                customer_id = matched_cust.id

        # 3. Fallback resolution: Lookup Customer by phone
        if not customer_id and res_in.customer_phone:
            matched_cust = self.db.scalar(
                select(Customer).where(Customer.phone == res_in.customer_phone)
            )
            if matched_cust:
                customer_id = matched_cust.id

        db_res = Reservation(
            id=res_id,
            customer_id=customer_id,
            customer_name=res_in.customer_name,
            customer_phone=res_in.customer_phone,
            customer_email=res_in.customer_email,
            guests_count=res_in.guests_count,
            date=res_in.date,
            time=res_in.time,
            seating_preference=res_in.seating_preference,
            status="Pending",
            special_request=res_in.special_request
        )
        self.db.add(db_res)
        self.db.commit()
        self.db.refresh(db_res)
        return db_res

    def update_status(self, res_id: str, status: str) -> Optional[Reservation]:
        res = self.get_by_id(res_id)
        if not res:
            return None
        res.status = status
        self.db.commit()
        self.db.refresh(res)
        return res
