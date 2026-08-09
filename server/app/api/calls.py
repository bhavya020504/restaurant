import urllib.request
import urllib.parse
from fastapi import APIRouter, HTTPException, Response
from typing import Optional
from app.services.snapserve import SnapServeRESTClient
from app.config import settings

from pydantic import BaseModel, Field
import logging

logger = logging.getLogger("uvicorn")

router = APIRouter(prefix="/calls", tags=["Calls"])

class OutboundOrderCallRequest(BaseModel):
    phone_number: str = Field(..., description="Customer phone number")
    name: Optional[str] = None
    email: Optional[str] = None

@router.post("/order")
@router.post("/order/")
def trigger_ai_order_call(req_data: OutboundOrderCallRequest):
    """
    Triggers an AI Order call (Agent 586) to the customer's phone number.
    Validates phone number and calls SnapServe REST API securely server-side.
    Zero SnapServe credentials are sent or returned to the browser.
    """
    if not settings.SNAPSERVE_API_KEY.strip():
        raise HTTPException(
            status_code=400,
            detail="SnapServe API Key is not configured on server"
        )

    phone = req_data.phone_number.strip().replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
    if len(phone) < 10:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid phone number with at least 10 digits."
        )

    # Normalize to E.164 format if 10-digit Indian phone provided without country code
    if len(phone) == 10 and phone.isdigit():
        phone = f"+91{phone}"
    elif not phone.startswith("+"):
        phone = f"+{phone}"

    try:
        client = SnapServeRESTClient()
        response = client.outbound_call(
            phone_number=phone,
            agent_id="586",
            name=req_data.name,
            email=req_data.email
        )
        logger.info(f"Outbound AI Order Call requested for phone: '{phone}' (Agent 586)")
        return {
            "success": True,
            "message": "Our AI ordering assistant will call you shortly.",
            "call_id": response.get("id") or response.get("call_id")
        }
    except Exception as e:
        logger.error(f"Failed to initiate outbound SnapServe call for {phone}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Sorry, we couldn't connect the call right now. Please try again."
        )

AGENT_NAME_MAP = {
    "586": "Call & Order Agent",
    "585": "Order Confirmation Agent",
    "588": "Call & Reservation Agent",
    "587": "Reservation Confirmation Agent",
}

CAMPAIGN_NAME_MAP = {
    "140": "restaurant order",
    "142": "restaurant_reservation",
    "122": "Website Leads",
    "116": "Website Leads",
}

@router.get("/snapserve-health")
@router.get("/snapserve-health/")
def get_snapserve_health():
    untrimmed_key = settings.SNAPSERVE_API_KEY.strip()
    if not untrimmed_key:
        return {
            "snapserve": "unconfigured",
            "detail": "SNAPSERVE_API_KEY environment variable is not configured.",
            "status": "warning"
        }

    try:
        client = SnapServeRESTClient()
        agents_resp = client.list_agents()
        campaigns_resp = client.list_campaigns()

        agents_data = agents_resp if isinstance(agents_resp, list) else (agents_resp.get("data", agents_resp.get("agents", [])) if isinstance(agents_resp, dict) else [])
        campaigns_data = campaigns_resp if isinstance(campaigns_resp, list) else (campaigns_resp.get("data", campaigns_resp.get("campaigns", [])) if isinstance(campaigns_resp, dict) else [])

        return {
            "snapserve": "connected",
            "agents_count": len(agents_data) if isinstance(agents_data, list) else 0,
            "campaigns_count": len(campaigns_data) if isinstance(campaigns_data, list) else 0,
            "status": "ok"
        }
    except Exception as e:
        return {
            "snapserve": "error",
            "detail": str(e),
            "status": "error"
        }

@router.get("/logs")
@router.get("/logs/")
def get_call_logs(limit: int = 50):
    """
    Fetches real-time call logs from SnapServe and enriches them with Agent Name,
    Campaign Name, and Backend Audio Stream Proxy URLs.
    """
    if not settings.SNAPSERVE_API_KEY:
        return []

    try:
        client = SnapServeRESTClient()
        raw_logs = client.get_call_logs(limit=limit)
        calls_list = raw_logs if isinstance(raw_logs, list) else raw_logs.get("data", raw_logs.get("calls", []))
        
        formatted = []
        for c in calls_list:
            if not isinstance(c, dict):
                continue
            
            call_id = str(c.get("id"))
            created_at_str = c.get("createdAt") or ""
            date_part = created_at_str[:10] if len(created_at_str) >= 10 else "2026-08-09"
            time_part = created_at_str[11:16] if len(created_at_str) >= 16 else "12:00"

            # Parse metadata safely if string
            meta = c.get("metadata", {})
            if isinstance(meta, str):
                import json
                try:
                    meta = json.loads(meta)
                except Exception:
                    meta = {}

            customer_name = meta.get("name") or meta.get("customer_name") or c.get("customerName") or "Customer"
            customer_phone = c.get("toNumber") or c.get("phoneNumber") or c.get("phone") or "—"
            raw_status = (c.get("status") or "").lower()
            status_str = "Answered" if raw_status == "completed" else ("Failed" if raw_status == "failed" else raw_status.capitalize())

            # Resolve Agent & Campaign Names
            agent_id = str(c.get("agentId") or "")
            agent_name = c.get("agentName") or AGENT_NAME_MAP.get(agent_id) or (f"Agent #{agent_id}" if agent_id else "SnapServe Voice AI")

            campaign_id = str(c.get("campaignId") or "")
            campaign_name = c.get("campaignName") or CAMPAIGN_NAME_MAP.get(campaign_id) or (f"Campaign #{campaign_id}" if campaign_id else "Order Confirmation")

            # Stream audio via backend proxy route so browser player works without 401/CORS errors
            has_rec = bool(c.get("recordingUrl") or c.get("recordingEnabled"))
            recording_proxy_url = f"https://restaurant-3d54.onrender.com/api/v1/calls/{call_id}/recording" if (has_rec and raw_status == "completed") else None

            formatted.append({
                "id": call_id,
                "customerName": customer_name,
                "customerPhone": customer_phone,
                "agentId": agent_id,
                "agentName": agent_name,
                "campaignId": campaign_id,
                "campaignName": campaign_name,
                "date": date_part,
                "time": time_part,
                "durationSeconds": c.get("durationSeconds") or 0,
                "status": status_str,
                "recordingUrl": recording_proxy_url,
                "hasRecording": bool(recording_proxy_url),
                "transcript": c.get("transcript"),
                "summary": c.get("callSummary")
            })

        return formatted
    except Exception as e:
        return []

@router.get("/{call_id}/recording")
@router.get("/recording/{call_id}")
def get_call_recording_stream(call_id: str):
    """
    Safely streams call recording audio bytes from SnapServe to the frontend audio player
    without exposing SNAPSERVE_API_KEY to the browser.
    """
    if not settings.SNAPSERVE_API_KEY:
        raise HTTPException(status_code=400, detail="SNAPSERVE_API_KEY is not configured")

    url = f"https://app.snapserve.ai/api/storage/recordings/{call_id}"
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {settings.SNAPSERVE_API_KEY.strip()}"}
    )

    try:
        with urllib.request.urlopen(req, timeout=15.0) as res:
            audio_bytes = res.read()
            content_type = res.headers.get("Content-Type") or "audio/wav"
            return Response(content=audio_bytes, media_type=content_type)
    except urllib.error.HTTPError as e:
        raise HTTPException(status_code=e.code, detail=f"Audio recording not available from SnapServe ({e.code})")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not stream call recording: {e}")

@router.get("/{call_id}")
def get_call_detail(call_id: str):
    """
    Fetches detailed call metadata, recording URL, transcript, and AI summary for a specific call.
    """
    if not settings.SNAPSERVE_API_KEY:
        return {"error": "SNAPSERVE_API_KEY is not configured"}

    try:
        client = SnapServeRESTClient()
        c = client.get_call(call_id)
        
        agent_id = str(c.get("agentId") or "")
        c["agentName"] = c.get("agentName") or AGENT_NAME_MAP.get(agent_id) or f"Agent #{agent_id}"

        campaign_id = str(c.get("campaignId") or "")
        c["campaignName"] = c.get("campaignName") or CAMPAIGN_NAME_MAP.get(campaign_id) or f"Campaign #{campaign_id}"

        has_rec = bool(c.get("recordingUrl") or c.get("recordingEnabled"))
        c["recordingUrl"] = f"https://restaurant-3d54.onrender.com/api/v1/calls/{call_id}/recording" if has_rec else None

        return c
    except Exception as e:
        return {"error": str(e)}
