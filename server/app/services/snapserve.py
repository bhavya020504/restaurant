import json
import logging
import urllib.request
import urllib.parse
from typing import Optional
from app.config import settings
from app.models.order import Order
from app.models.reservation import Reservation
from app.models.customer import Customer

logger = logging.getLogger("uvicorn")

def trigger_order_confirmation(order: Order, customer: Optional[Customer] = None) -> bool:
    """
    Triggers the SnapServe Voice AI Order Confirmation Campaign after an order is committed to PostgreSQL.
    
    CRITICAL RELIABILITY & SECURITY GUARANTEES:
    1. Executed ONLY AFTER successful database transaction commit (PostgreSQL first).
    2. Runs safely inside error boundaries; any network or webhook failure is caught and logged.
    3. Webhook failure NEVER rolls back or duplicates the order in PostgreSQL.
    4. Secrets, JWTs, and full sensitive URL tokens are masked in logging output.
    """
    webhook_url = getattr(settings, "SNAPSERVE_ORDER_CONFIRMATION_WEBHOOK_URL", "").strip()
    if not webhook_url:
        logger.info("SnapServe order confirmation webhook URL is empty; skipping voice campaign trigger.")
        return False

    try:
        payload = {
            "name": order.customer_name,
            "phone": order.customer_phone,
            "email": order.customer_email,
            "order_id": order.id,
            "total_amount": float(order.total_amount),
            "delivery_address": order.delivery_address or ""
        }

        json_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            webhook_url,
            data=json_data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "BR-Kitchen-Backend/1.0"
            },
            method="POST"
        )

        parsed_url = urllib.parse.urlparse(webhook_url)
        masked_host = parsed_url.netloc or "app.snapserve.ai"
        logger.info(f"Triggering SnapServe Voice Campaign for Order '{order.id}' via '{masked_host}'...")

        with urllib.request.urlopen(req, timeout=5.0) as response:
            status_code = response.status
            body = response.read().decode("utf-8", errors="ignore")
            logger.info(f"SnapServe Voice Campaign triggered successfully for Order '{order.id}' [Status: {status_code}]")
            return True

    except Exception as e:
        logger.warning(f"SnapServe Voice Campaign trigger failed for Order '{order.id}' (Order remains saved in PostgreSQL): {e}")
        return False


def trigger_reservation_confirmation(reservation: Reservation, customer: Optional[Customer] = None) -> bool:
    """
    Triggers the SnapServe Voice AI Reservation Confirmation Campaign after a reservation is committed to PostgreSQL.
    
    CRITICAL RELIABILITY & SECURITY GUARANTEES:
    1. Executed ONLY AFTER successful database transaction commit (PostgreSQL first).
    2. Runs safely inside error boundaries; any network or webhook failure is caught and logged.
    3. Webhook failure NEVER rolls back or duplicates the reservation in PostgreSQL.
    4. Secrets, JWTs, and full sensitive URL tokens are masked in logging output.
    """
    webhook_url = getattr(settings, "SNAPSERVE_RESERVATION_CONFIRMATION_WEBHOOK_URL", "").strip()
    if not webhook_url:
        logger.info("SnapServe reservation confirmation webhook URL is empty; skipping voice campaign trigger.")
        return False

    try:
        payload = {
            "name": reservation.customer_name,
            "phone": reservation.customer_phone,
            "email": reservation.customer_email,
            "reservation_id": reservation.id,
            "guests_count": reservation.guests_count,
            "date": reservation.date,
            "time": reservation.time,
            "seating_preference": reservation.seating_preference,
            "special_request": reservation.special_request or ""
        }

        json_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            webhook_url,
            data=json_data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "BR-Kitchen-Backend/1.0"
            },
            method="POST"
        )

        parsed_url = urllib.parse.urlparse(webhook_url)
        masked_host = parsed_url.netloc or "app.snapserve.ai"
        logger.info(f"Triggering SnapServe Voice Campaign for Reservation '{reservation.id}' via '{masked_host}'...")

        with urllib.request.urlopen(req, timeout=5.0) as response:
            status_code = response.status
            body = response.read().decode("utf-8", errors="ignore")
            logger.info(f"SnapServe Voice Campaign triggered successfully for Reservation '{reservation.id}' [Status: {status_code}]")
            return True

    except Exception as e:
        logger.warning(f"SnapServe Voice Campaign trigger failed for Reservation '{reservation.id}' (Reservation remains saved in PostgreSQL): {e}")
        return False
