from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.session import get_db
from app.schemas.food import FoodResponse, FoodCreate, FoodUpdate
from app.repositories.food_repository import FoodRepository

router = APIRouter(prefix="/foods", tags=["Foods"])

@router.get("", response_model=List[FoodResponse])
@router.get("/", response_model=List[FoodResponse])
def get_foods(category: Optional[str] = None, db: Session = Depends(get_db)):
    repo = FoodRepository(db)
    return repo.get_all(category=category)

@router.get("/{food_id}", response_model=FoodResponse)
def get_food(food_id: str, db: Session = Depends(get_db)):
    repo = FoodRepository(db)
    food = repo.get_by_id(food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food item not found")
    return food

@router.post("", response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=FoodResponse, status_code=status.HTTP_201_CREATED)
def create_food(food_in: FoodCreate, db: Session = Depends(get_db)):
    repo = FoodRepository(db)
    return repo.create(food_in)

@router.put("/{food_id}", response_model=FoodResponse)
def update_food(food_id: str, food_in: FoodUpdate, db: Session = Depends(get_db)):
    repo = FoodRepository(db)
    updated = repo.update(food_id, food_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Food item not found")
    return updated

@router.delete("/{food_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_food(food_id: str, db: Session = Depends(get_db)):
    repo = FoodRepository(db)
    success = repo.delete(food_id)
    if not success:
        raise HTTPException(status_code=404, detail="Food item not found")
