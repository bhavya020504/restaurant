# BR KITCHEN - FastAPI Backend & Neon PostgreSQL Integration

This directory contains the production-ready **FastAPI** backend for the **BR KITCHEN** Restaurant Management Platform, powered by **SQLAlchemy 2.0**, **Alembic**, and **Neon PostgreSQL**.

---

## 🚀 Quick Setup Instructions

### 1. Configure Neon PostgreSQL Database Connection
Edit the local `.env` file in the `server/` directory:

```env
DATABASE_URL=postgresql://<user>:<password>@<neon-endpoint>.neon.tech/<dbname>?sslmode=require
```

> Replace `<user>`, `<password>`, `<neon-endpoint>`, and `<dbname>` with your actual Neon PostgreSQL connection string.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Alembic Database Migrations
To sync database models with your Neon PostgreSQL instance:
```bash
alembic revision --autogenerate -m "initial_tables"
alembic upgrade head
```

### 4. Start Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

Access Interactive API Documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
