import json
import logging
import urllib.request
import urllib.parse
from typing import Optional, Any
from datetime import datetime
from app.config import settings
from app.models.order import Order
from app.models.reservation import Reservation
from app.models.customer import Customer

logger = logging.getLogger("uvicorn")

_triggered_order_ids = set()

def format_items_summary(items_json) -> str:
    """Formats items_json array into prompt-friendly string summary (e.g. '3x Truffle Wagyu Burger')."""
    if not items_json:
        return "1x Restaurant Meal"
    if isinstance(items_json, str):
        try:
            items_json = json.loads(items_json)
        except Exception:
            return items_json
    if isinstance(items_json, list):
        formatted = []
        for item in items_json:
            if isinstance(item, dict):
                qty = item.get("quantity", 1)
                name = item.get("name") or item.get("food_name") or item.get("food_id") or "Item"
                formatted.append(f"{qty}x {name}")
            else:
                formatted.append(str(item))
        return ", ".join(formatted) if formatted else "1x Restaurant Meal"
    return str(items_json)

def trigger_order_confirmation(order: Order, customer: Optional[Customer] = None, db: Optional[Any] = None) -> bool:
    """
    Triggers the SnapServe Voice AI Order Confirmation Campaign after an order is committed to PostgreSQL.
    
    CRITICAL RELIABILITY & PERSISTENT IDEMPOTENCY GUARANTEES:
    1. Executed ONLY AFTER successful database transaction commit (PostgreSQL first).
    2. Persistent Idempotency: Checks order.snapserve_status in PostgreSQL; survives app restarts & worker reboots.
    3. Runs safely inside error boundaries; any network or webhook failure is caught and recorded in DB.
    4. Webhook failure NEVER rolls back or invalidates the committed order in PostgreSQL.
    5. Secrets, JWTs, and full sensitive URL tokens are masked in logging output.
    """
    if getattr(order, "snapserve_status", None) in ("DISPATCHED", "SUCCESS"):
        logger.info(f"SnapServe confirmation call already dispatched for Order '{order.id}'; skipping duplicate dispatch.")
        return True

    if order.id in _triggered_order_ids:
        logger.info(f"SnapServe confirmation call already dispatched in memory for Order '{order.id}'; skipping duplicate dispatch.")
        return True

    webhook_url = getattr(settings, "SNAPSERVE_ORDER_CONFIRMATION_WEBHOOK_URL", "").strip()
    if not webhook_url:
        logger.info("SnapServe order confirmation webhook URL is empty; skipping voice campaign trigger.")
        return False

    try:
        phone = (order.customer_phone or "").strip().replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
        if len(phone) == 10 and phone.isdigit():
            phone = f"+91{phone}"
        elif len(phone) == 12 and phone.startswith("91") and phone.isdigit():
            phone = f"+{phone}"
        elif phone and not phone.startswith("+"):
            phone = f"+{phone}"

        payload = {
            "name": order.customer_name or "Valued Customer",
            "phone": phone or "—",
            "email": order.customer_email or "—",
            "order_id": order.id,
            "total_amount": float(order.total_amount),
            "items": format_items_summary(order.items_json),
            "estimated_time": getattr(order, "estimated_delivery_time", "") or "30 mins",
            "delivery_address": order.delivery_address or "No delivery address provided"
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
            _triggered_order_ids.add(order.id)
            
            # Persist successful dispatch state to PostgreSQL
            order.snapserve_status = "DISPATCHED"
            order.snapserve_dispatched_at = datetime.utcnow()
            order.snapserve_error = None
            if db:
                try:
                    db.add(order)
                    db.commit()
                except Exception as db_err:
                    logger.warning(f"Could not persist snapserve_status=DISPATCHED to DB: {db_err}")

            return True

    except Exception as e:
        safe_err = str(e)[:250]
        logger.warning(f"SnapServe Voice Campaign trigger failed for Order '{order.id}' (Order remains saved in PostgreSQL): {safe_err}")
        
        # Persist failed dispatch state to PostgreSQL for observable retry
        order.snapserve_status = "FAILED"
        order.snapserve_error = safe_err
        if db:
            try:
                db.add(order)
                db.commit()
            except Exception as db_err:
                logger.warning(f"Could not persist snapserve_status=FAILED to DB: {db_err}")

        return False


def trigger_reservation_confirmation(reservation: Reservation, customer: Optional[Customer] = None, db: Optional[Any] = None) -> bool:
    """
    Triggers the SnapServe Voice AI Reservation Confirmation Campaign after a reservation is committed to PostgreSQL.
    
    CRITICAL RELIABILITY & PERSISTENT IDEMPOTENCY GUARANTEES:
    1. Executed ONLY AFTER successful database transaction commit (PostgreSQL first).
    2. Persistent Idempotency: Checks reservation.whatsapp_status / email_status in PostgreSQL; survives restarts.
    3. Runs safely inside error boundaries; network failure NEVER rolls back or invalidates the committed reservation in PostgreSQL.
    4. Secrets, JWTs, and full sensitive URL tokens are masked in logging output.
    """
    if getattr(reservation, "whatsapp_status", None) in ("DISPATCHED", "SUCCESS"):
        logger.info(f"SnapServe confirmation campaign already dispatched for Reservation '{reservation.id}'; skipping duplicate dispatch.")
        return True

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
            
            # Persist notification dispatch status to PostgreSQL
            reservation.whatsapp_status = "DISPATCHED"
            reservation.email_status = "DISPATCHED" if reservation.customer_email and reservation.customer_email != "—" else "SKIPPED"
            reservation.whatsapp_dispatched_at = datetime.utcnow()
            reservation.email_dispatched_at = datetime.utcnow()
            if db:
                try:
                    db.add(reservation)
                    db.commit()
                except Exception as db_err:
                    logger.warning(f"Could not persist notification status to DB: {db_err}")

            return True

    except Exception as e:
        safe_err = str(e)[:250]
        logger.warning(f"SnapServe Voice Campaign trigger failed for Reservation '{reservation.id}' (Reservation remains saved in PostgreSQL): {safe_err}")
        
        reservation.whatsapp_status = "FAILED"
        reservation.email_status = "FAILED"
        if db:
            try:
                db.add(reservation)
                db.commit()
            except Exception as db_err:
                logger.warning(f"Could not persist notification FAILED status to DB: {db_err}")

        return False


class SnapServeRESTClient:
    """
    Server-side REST client for SnapServe platform operations.
    Authentication is handled strictly via server environment settings (SNAPSERVE_API_KEY).
    Secrets are NEVER returned in raw log outputs or API responses.
    """
    def __init__(self):
        self.base_url = (getattr(settings, "SNAPSERVE_BASE_URL", "") or "https://app.snapserve.ai/api").rstrip("/")
        self.api_key = getattr(settings, "SNAPSERVE_API_KEY", "").strip()

    def _request(self, endpoint: str, method: str = "GET", payload: Optional[dict] = None) -> dict:
        if not self.api_key:
            raise ValueError("SNAPSERVE_API_KEY environment variable is not configured.")

        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "BR-Kitchen-Backend/1.0",
            "Authorization": f"Bearer {self.api_key}"
        }

        data = json.dumps(payload).encode("utf-8") if payload else None
        req = urllib.request.Request(url, data=data, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=10.0) as response:
                body = response.read().decode("utf-8", errors="ignore")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="ignore")
            logger.warning(f"SnapServe REST API error [{e.code}] on {method} {endpoint}: {error_body}")
            raise RuntimeError(f"SnapServe API returned status {e.code}")
        except Exception as e:
            logger.error(f"SnapServe REST API connection failed on {method} {endpoint}: {e}")
            raise RuntimeError(f"SnapServe connection error: {e}")

    def list_agents(self) -> dict:
        return self._request("agents", method="GET")

    def list_campaigns(self) -> dict:
        return self._request("campaigns", method="GET")

    def get_agent(self, agent_id: str) -> dict:
        return self._request(f"agents/{agent_id}", method="GET")

    def get_campaign(self, campaign_id: str) -> dict:
        return self._request(f"campaigns/{campaign_id}", method="GET")

    def get_call(self, call_id: str) -> dict:
        return self._request(f"calls/{call_id}", method="GET")

    def get_call_logs(self, agent_id: Optional[str] = None, status: Optional[str] = None, limit: int = 20) -> dict:
        params = []
        if agent_id:
            params.append(f"agent_id={urllib.parse.quote(str(agent_id))}")
        if status:
            params.append(f"status={urllib.parse.quote(str(status))}")
        if limit:
            params.append(f"limit={limit}")
        query_str = "?" + "&".join(params) if params else ""
        return self._request(f"calls{query_str}", method="GET")

    def outbound_call(self, phone_number: str, agent_id: str = "586", name: Optional[str] = None, email: Optional[str] = None) -> dict:
        """
        Triggers an outbound call using SnapServe REST API (POST /api/calls/outbound).
        SnapServe expects toNumber (string) and agentId (integer).
        """
        try:
            agent_int_id = int(agent_id)
        except (ValueError, TypeError):
            agent_int_id = 586

        payload = {
            "toNumber": phone_number,
            "agentId": agent_int_id,
            "phone_number": phone_number,
            "agent_id": str(agent_id)
        }
        if name:
            payload["name"] = name
        if email:
            payload["email"] = email

        return self._request("calls/outbound", method="POST", payload=payload)


snapserve_rest_client = SnapServeRESTClient()
