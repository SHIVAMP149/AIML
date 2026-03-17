from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_records: int
    avg_water_liters: float
    avg_energy_kwh: float
    avg_total_cost: float
    latest_water_liters: float
    latest_energy_kwh: float
    latest_total_cost: float
