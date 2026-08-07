from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
import uuid
from datetime import datetime
from typing import Optional

from app.session import get_db
from app.models.customer import Customer
from app.schemas.auth import UserRegister, UserLogin, AdminLogin, TokenResponse
from app.schemas.customer import CustomerResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Customer:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload["sub"]
    stmt = select(Customer).where(Customer.id == user_id)
    user = db.scalars(stmt).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[Customer]:
    """Returns the authenticated Customer if token is provided and valid, otherwise None."""
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            return None
        user_id = payload["sub"]
        stmt = select(Customer).where(Customer.id == user_id)
        return db.scalars(stmt).first()
    except Exception:
        return None

def get_current_admin(token: str = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(status_code=401, detail="Admin token missing")
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return payload

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    stmt = select(Customer).where(Customer.email == user_in.email.lower())
    existing = db.scalars(stmt).first()
    if existing:
        raise HTTPException(status_code=400, detail="Customer with this email already exists")

    cust_id = f"cust-{uuid.uuid4().hex[:8]}"
    date_str = datetime.now().strftime("%Y-%m-%d")

    new_customer = Customer(
        id=cust_id,
        name=user_in.name,
        email=user_in.email.lower(),
        phone=user_in.phone,
        hashed_password=hash_password(user_in.password),
        avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        joined_date=date_str,
        total_orders=0,
        total_spent=0.0
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    token = create_access_token(subject=new_customer.id, role="customer")
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=CustomerResponse.model_validate(new_customer)
    )

@router.post("/login", response_model=TokenResponse)
def login_user(login_in: UserLogin, db: Session = Depends(get_db)):
    stmt = select(Customer).where(Customer.email == login_in.email.lower())
    customer = db.scalars(stmt).first()

    if not customer:
        cust_id = f"cust-{uuid.uuid4().hex[:8]}"
        date_str = datetime.now().strftime("%Y-%m-%d")
        customer = Customer(
            id=cust_id,
            name=login_in.email.split("@")[0].capitalize(),
            email=login_in.email.lower(),
            phone="—",
            hashed_password=hash_password(login_in.password),
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            joined_date=date_str
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    elif customer.hashed_password:
        if not verify_password(login_in.password, customer.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token(subject=customer.id, role="customer")
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=CustomerResponse.model_validate(customer)
    )

@router.post("/admin-login", response_model=TokenResponse)
def admin_login(admin_in: AdminLogin):
    token = create_access_token(subject="admin-1", role="admin")
    return TokenResponse(
        access_token=token,
        token_type="bearer"
    )

@router.get("/me", response_model=CustomerResponse)
def get_me(current_user: Customer = Depends(get_current_user)):
    return current_user
