from datetime import date

from pydantic import BaseModel, Field


class ConsumptionCreate(BaseModel):
    date: date
    water_consumption_liters: float = Field(gt=0)
    energy_consumption_kwh: float = Field(gt=0)
    water_cost: float = Field(gt=0)
    energy_cost: float = Field(gt=0)
    avg_temperature: float
    occupancy_count: int = Field(ge=1)
    is_holiday: int = Field(ge=0, le=1)


class ConsumptionRead(ConsumptionCreate):
    pass
