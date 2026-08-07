from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.session import get_db
from app.schemas.customer import CustomerResponse, CustomerCreate
from app.repositories.customer_repository import CustomerRepository

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    repo = CustomerRepository(db)
    return repo.get_all()

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    repo = CustomerRepository(db)
    customer = repo.get_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer_in: CustomerCreate, db: Session = Depends(get_db)):
    repo = CustomerRepository(db)
    return repo.create(customer_in)
