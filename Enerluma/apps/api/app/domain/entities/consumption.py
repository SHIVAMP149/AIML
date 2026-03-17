from dataclasses import dataclass
from datetime import date


@dataclass
class ConsumptionRecord:
    date: date
    water_consumption_liters: float
    energy_consumption_kwh: float
    water_cost: float
    energy_cost: float
    avg_temperature: float
    occupancy_count: int
    is_holiday: int
