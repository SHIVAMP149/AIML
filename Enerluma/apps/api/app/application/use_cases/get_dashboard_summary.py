from __future__ import annotations

from statistics import mean

from app.domain.repositories.consumption_repository import ConsumptionRepository


class GetDashboardSummaryUseCase:
    def __init__(self, repository: ConsumptionRepository):
        self.repository = repository

    def execute(self) -> dict[str, float | int]:
        rows = self.repository.list_records()

        if not rows:
            return {
                "total_records": 0,
                "avg_water_liters": 0,
                "avg_energy_kwh": 0,
                "avg_total_cost": 0,
                "latest_water_liters": 0,
                "latest_energy_kwh": 0,
                "latest_total_cost": 0,
            }

        avg_water = mean([r.water_consumption_liters for r in rows])
        avg_energy = mean([r.energy_consumption_kwh for r in rows])
        avg_cost = mean([r.water_cost + r.energy_cost for r in rows])

        latest = rows[-1]
        latest_total_cost = latest.water_cost + latest.energy_cost

        return {
            "total_records": len(rows),
            "avg_water_liters": round(avg_water, 2),
            "avg_energy_kwh": round(avg_energy, 2),
            "avg_total_cost": round(avg_cost, 2),
            "latest_water_liters": round(latest.water_consumption_liters, 2),
            "latest_energy_kwh": round(latest.energy_consumption_kwh, 2),
            "latest_total_cost": round(latest_total_cost, 2),
        }
