from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.customer import CustomerResponse

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AdminLogin(BaseModel):
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[CustomerResponse] = None
