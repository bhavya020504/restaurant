from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.foods import router as foods_router
from app.api.orders import router as orders_router
from app.api.customers import router as customers_router
from app.api.reservations import router as reservations_router
from app.api.complaints import router as complaints_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(foods_router)
api_router.include_router(orders_router)
api_router.include_router(customers_router)
api_router.include_router(reservations_router)
api_router.include_router(complaints_router)
