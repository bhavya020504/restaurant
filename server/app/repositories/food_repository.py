from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.food import Food
from app.schemas.food import FoodCreate, FoodUpdate
import uuid

class FoodRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, category: Optional[str] = None) -> List[Food]:
        stmt = select(Food)
        if category and category != "All":
            stmt = stmt.where(Food.category == category)
        return list(self.db.scalars(stmt).all())

    def get_by_id(self, food_id: str) -> Optional[Food]:
        stmt = select(Food).where(Food.id == food_id)
        return self.db.scalars(stmt).first()

    def create(self, food_in: FoodCreate) -> Food:
        food_id = food_in.id or f"food-{uuid.uuid4().hex[:8]}"
        db_food = Food(
            id=food_id,
            name=food_in.name,
            category=food_in.category,
            price=food_in.price,
            rating=food_in.rating,
            review_count=food_in.review_count,
            image=food_in.image,
            description=food_in.description,
            prep_time_minutes=food_in.prep_time_minutes,
            calories=food_in.calories,
            is_popular=food_in.is_popular,
            is_featured=food_in.is_featured,
            is_veg=food_in.is_veg,
            is_spicy=food_in.is_spicy,
            in_stock=food_in.in_stock
        )
        self.db.add(db_food)
        self.db.commit()
        self.db.refresh(db_food)
        return db_food

    def update(self, food_id: str, food_in: FoodUpdate) -> Optional[Food]:
        food = self.get_by_id(food_id)
        if not food:
            return None
        update_data = food_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(food, key, value)
        self.db.commit()
        self.db.refresh(food)
        return food

    def delete(self, food_id: str) -> bool:
        food = self.get_by_id(food_id)
        if not food:
            return False
        self.db.delete(food)
        self.db.commit()
        return True
