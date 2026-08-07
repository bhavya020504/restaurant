from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.session import get_db
from app.models.order import Order
from app.models.customer import Customer
from app.models.reservation import Reservation
from app.models.complaint import Complaint

router = APIRouter(prefix="/admin", tags=["Admin Dashboard & Analytics"])

@router.get("/dashboard")
def get_dashboard_kpis(db: Session = Depends(get_db)):
    # Calculate live aggregate metrics from PostgreSQL database
    total_revenue_result = db.scalar(select(func.sum(Order.total_amount))) or 0.0
    total_orders_count = db.scalar(select(func.count(Order.id))) or 0
    total_customers_count = db.scalar(select(func.count(Customer.id))) or 0
    total_reservations_count = db.scalar(select(func.count(Reservation.id))) or 0
    open_complaints_count = db.scalar(select(func.count(Complaint.id)).where(Complaint.status != "Resolved")) or 0
    avg_rating_result = db.scalar(select(func.avg(Order.rating)).where(Order.rating.isnot(None))) or 5.0

    return {
        "today_revenue": round(float(total_revenue_result), 2),
        "today_orders": total_orders_count,
        "active_customers": total_customers_count,
        "today_reservations": total_reservations_count,
        "open_complaints": open_complaints_count,
        "avg_feedback_rating": round(float(avg_rating_result), 1)
    }

@router.get("/analytics")
def get_analytics_data(db: Session = Depends(get_db)):
    return {
        "revenue_trend": [],
        "orders_by_category": [],
        "weekly_orders": [],
        "reservations_trend": [],
        "complaint_distribution": []
    }
