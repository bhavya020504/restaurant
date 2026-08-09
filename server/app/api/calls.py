from fastapi import APIRouter
from app.services.snapserve import SnapServeRESTClient
from app.config import settings

router = APIRouter(prefix="/calls", tags=["Calls"])

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
    Fetches real-time call logs from SnapServe and formats them for the Admin Dashboard.
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
            status_str = "Answered" if raw_status == "completed" else "Failed"

            recording_url = c.get("recordingUrl")
            if recording_url and recording_url.startswith("/"):
                recording_url = f"https://app.snapserve.ai{recording_url}"

            formatted.append({
                "id": str(c.get("id")),
                "customerName": customer_name,
                "customerPhone": customer_phone,
                "date": date_part,
                "time": time_part,
                "durationSeconds": c.get("durationSeconds") or 0,
                "status": status_str,
                "recordingUrl": recording_url,
                "transcript": c.get("transcript"),
                "summary": c.get("callSummary")
            })

        return formatted
    except Exception as e:
        return []

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
        recording_url = c.get("recordingUrl")
        if recording_url and recording_url.startswith("/"):
            recording_url = f"https://app.snapserve.ai{recording_url}"
        
        c["recordingUrl"] = recording_url
        return c
    except Exception as e:
        return {"error": str(e)}
