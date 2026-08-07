import logging
from sqlalchemy import text
from app.database import engine

logger = logging.getLogger("uvicorn")

def apply_column_migrations():
    logger.info("Applying column migration checks for PostgreSQL database...")
    statements = [
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id VARCHAR(50);",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS rating INTEGER;",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS review TEXT;",
        "ALTER TABLE orders ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;",
        "ALTER TABLE reservations ADD COLUMN IF NOT EXISTS customer_id VARCHAR(50);",
        "ALTER TABLE complaints ADD COLUMN IF NOT EXISTS customer_id VARCHAR(50);"
    ]

    with engine.begin() as conn:
        for stmt in statements:
            try:
                conn.execute(text(stmt))
                logger.info(f"Executed DDL: {stmt}")
            except Exception as e:
                logger.warning(f"DDL statement error ({stmt}): {e}")

if __name__ == "__main__":
    apply_column_migrations()
    print("Database column migrations applied successfully!")
