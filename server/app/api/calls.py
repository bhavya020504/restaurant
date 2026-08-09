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
