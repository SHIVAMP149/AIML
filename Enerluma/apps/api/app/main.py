from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.presentation.api.v1.routes import auth, consumption, dashboard, health, insights

app = FastAPI(title="Enerluma API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(consumption.router, prefix="/api/v1", tags=["Consumption"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(insights.router, prefix="/api/v1", tags=["Insights"])
