from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class FoodBase(BaseModel):
    name: str
    category: str
    price: float
    rating: float = 4.8
    review_count: int = 0
    image: str
    description: str
    prep_time_minutes: int = 15
    calories: int = 500
    is_popular: bool = False
    is_featured: bool = False
    is_veg: bool = False
    is_spicy: bool = False
    in_stock: bool = True

class FoodCreate(FoodBase):
    id: Optional[str] = None

class FoodUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    in_stock: Optional[bool] = None

class FoodResponse(FoodBase):
    id: str
    model_config = ConfigDict(from_attributes=True)
