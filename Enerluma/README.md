# Enerluma

Enerluma is a full-stack smart water and energy management platform with a polished landing page, analytics dashboard, clean architecture backend, and PostgreSQL storage.

The backend includes AI/ML insights using:
- Random Forest regressors for next-period water, energy, and cost forecasting
- Isolation Forest for anomaly detection and risk scoring
- Persistent model artifacts (joblib) with automatic retrain when source data changes

Authentication uses JWT Bearer tokens with bcrypt password hashing.

## Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy 2.0, Pydantic v2
- Database: PostgreSQL 16
- Infrastructure: Docker Compose

## Monorepo Layout

- `apps/web`: Frontend app (landing page + dashboard)
- `apps/api`: Backend service with clean architecture layers

## Quick Start (Docker)

1. Copy `.env.example` to `.env` and adjust values.
2. Start services:

```bash
docker compose up --build
```

3. Open:
- Frontend: `http://localhost:3000`
- API docs: `http://localhost:8000/docs`

## Local Development

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

## API Endpoints

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/token`
- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/insights` (ML forecast + anomaly + recommendations)
- `GET /api/v1/consumption`
- `POST /api/v1/consumption`

## Authentication Flow

1. Register from the web UI at `/login` or call `POST /api/v1/auth/register`.
2. Login to receive an access token from `POST /api/v1/auth/token`.
3. Use `Authorization: Bearer <token>` for protected routes:
- `/api/v1/consumption`
- `/api/v1/dashboard/summary`
- `/api/v1/dashboard/insights`
- `/api/v1/auth/me`

## Clean Architecture Overview

- Domain: business entities and repository contracts
- Application: use cases and orchestration logic
- Infrastructure: ORM models and repository implementations
- Presentation: HTTP routes and response schemas
