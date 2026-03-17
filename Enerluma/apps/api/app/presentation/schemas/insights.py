from pydantic import BaseModel


class ForecastBlock(BaseModel):
    water_next: float
    energy_next: float
    cost_next: float


class AnomalyBlock(BaseModel):
    high_water: bool
    high_energy: bool
    risk_level: str


class InsightsResponse(BaseModel):
    forecast: ForecastBlock
    anomaly: AnomalyBlock
    recommendations: list[str]
