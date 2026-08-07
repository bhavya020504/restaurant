import logging
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.config import settings
from app.database import SessionLocal
from app.models import Food

logger = logging.getLogger("uvicorn")

INITIAL_FOODS = [
  {
    "id": "food-1",
    "name": "Truffle Wagyu Reserve Burger",
    "category": "Artisan Burgers",
    "price": 24.99,
    "rating": 4.9,
    "review_count": 312,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "description": "Aged A5 Wagyu patty layered with black truffle aioli, aged Gruyère cheese, caramelized shallots, and organic arugula served on a toasted brioche bun.",
    "prep_time_minutes": 18,
    "calories": 840,
    "is_popular": True,
    "is_featured": True,
    "is_veg": False,
    "is_spicy": False,
    "in_stock": True
  },
  {
    "id": "food-2",
    "name": "Smoked Burrata Margherita Pizza",
    "category": "Woodfired Pizza",
    "price": 19.50,
    "rating": 4.8,
    "review_count": 240,
    "image": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    "description": "Hand-stretched sourdough, San Marzano tomato reduction, fresh smoked burrata heart, Genovese basil oil, and toasted pine nuts.",
    "prep_time_minutes": 15,
    "calories": 680,
    "is_popular": True,
    "is_featured": True,
    "is_veg": True,
    "is_spicy": False,
    "in_stock": True
  },
  {
    "id": "food-3",
    "name": "Pan-Seared Chilean Sea Bass",
    "category": "Chef Specials",
    "price": 34.00,
    "rating": 5.0,
    "review_count": 185,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "description": "Sustainably caught Chilean sea bass pan-seared with saffron beurre blanc, saffron lemon butter, roasted asparagus, and potato puree.",
    "prep_time_minutes": 22,
    "calories": 590,
    "is_popular": False,
    "is_featured": True,
    "is_veg": False,
    "is_spicy": False,
    "in_stock": True
  },
  {
    "id": "food-4",
    "name": "Wild Mushroom Truffle Tagliatelle",
    "category": "Pasta & Risotto",
    "price": 22.00,
    "rating": 4.7,
    "review_count": 198,
    "image": "https://images.unsplash.com/photo-1621996346565-e3d5d6288337?auto=format&fit=crop&w=800&q=80",
    "description": "Fresh egg tagliatelle tossed in parmigiano reggiano cream, porcini mushroom reduction, white truffle essence, and fresh thyme.",
    "prep_time_minutes": 16,
    "calories": 720,
    "is_popular": True,
    "is_featured": False,
    "is_veg": True,
    "is_spicy": False,
    "in_stock": True
  },
  {
    "id": "food-5",
    "name": "Dragon Flame Roll (8pcs)",
    "category": "Sushi & Asian",
    "price": 21.50,
    "rating": 4.9,
    "review_count": 275,
    "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    "description": "Tempura prawn and cucumber roll topped with flame-torched spicy salmon, unagi glaze, spicy mayo, and tobiko caviar.",
    "prep_time_minutes": 14,
    "calories": 510,
    "is_popular": True,
    "is_featured": True,
    "is_veg": False,
    "is_spicy": True,
    "in_stock": True
  },
  {
    "id": "food-6",
    "name": "Valrhona Chocolate Lava Cake",
    "category": "Desserts & Shakes",
    "price": 13.50,
    "rating": 4.9,
    "review_count": 410,
    "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    "description": "Warm French Valrhona dark chocolate cake with a molten chocolate center, served with Tahitian vanilla bean gelato and berry coulis.",
    "prep_time_minutes": 12,
    "calories": 540,
    "is_popular": True,
    "is_featured": False,
    "is_veg": True,
    "is_spicy": False,
    "in_stock": True
  }
]

def seed_database():
    if not settings.ENABLE_SEED:
        logger.info("Automatic database seeding is disabled (ENABLE_SEED=false). Skipping seed.")
        return

    db: Session = SessionLocal()
    try:
        existing_food = db.scalar(select(Food.id))
        if not existing_food:
            logger.info("ENABLE_SEED=true: Seeding initial menu foods into PostgreSQL...")
            for f_data in INITIAL_FOODS:
                food = Food(**f_data)
                db.add(food)
            db.commit()
            logger.info("Seeded initial gourmet menu foods successfully!")
    except Exception as e:
        logger.warning(f"Database seeding deferred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
