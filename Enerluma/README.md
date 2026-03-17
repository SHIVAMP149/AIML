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

### Updated Frontend Routes

The web app now includes the following pages:

1. `/` — Landing Page
2. `/about` (alias: `/about-project`) — About Project
3. `/login` — Login
4. `/register` — Register
5. `/dashboard` — Dashboard
6. `/energy-monitoring` — Energy Monitoring
7. `/water-monitoring` — Water Monitoring
8. `/ai-prediction` — AI Prediction
9. `/analytics` — Analytics
10. `/alerts` (alias: `/alerts-notifications`) — Alerts & Notifications
11. `/recommendations` — Recommendations
12. `/profile` — User Profile
13. `/settings` — Settings
14. `/admin` — Admin Panel
15. `/support` (alias: `/contact`) — Contact / Support

All authenticated workspace pages reuse existing APIs:
- `GET /api/v1/auth/me`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/dashboard/insights`
- `GET /api/v1/consumption`

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

## AI/ML Implementation (Existing + Used in UI)

- **Energy prediction**: Random Forest regression
- **Water prediction**: Random Forest regression
- **Cost prediction**: Random Forest regression
- **Anomaly detection**: Isolation Forest
- **Recommendations**: risk-aware suggestion generation based on model outputs and thresholds

The frontend pages `Dashboard`, `AI Prediction`, `Analytics`, `Alerts`, and `Recommendations` consume these insights through `/api/v1/dashboard/insights`.

## Architecture Snapshot

```text
apps/api
├── domain/            # entities + repository contracts
├── application/       # use cases (summary, insights)
├── infrastructure/    # SQLAlchemy models, repository impl, ML model store
└── presentation/      # FastAPI routes + schemas

apps/web
├── app/               # Next.js route pages
├── components/        # UI sections and shared workspace component
└── lib/               # auth storage + API client
```

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
