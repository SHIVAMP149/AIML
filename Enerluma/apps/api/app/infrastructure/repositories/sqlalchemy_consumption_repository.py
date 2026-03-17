from __future__ import annotations

from sqlalchemy.orm import Session

from app.domain.entities.consumption import ConsumptionRecord
from app.domain.repositories.consumption_repository import ConsumptionRepository
from app.infrastructure.models.consumption_model import ConsumptionModel


class SQLAlchemyConsumptionRepository(ConsumptionRepository):
    def __init__(self, db: Session):
        self.db = db

    def list_records(self) -> list[ConsumptionRecord]:
        rows = self.db.query(ConsumptionModel).order_by(ConsumptionModel.date.asc()).all()
        return [
            ConsumptionRecord(
                date=row.date,
                water_consumption_liters=row.water_consumption_liters,
                energy_consumption_kwh=row.energy_consumption_kwh,
                water_cost=row.water_cost,
                energy_cost=row.energy_cost,
                avg_temperature=row.avg_temperature,
                occupancy_count=row.occupancy_count,
                is_holiday=row.is_holiday,
            )
            for row in rows
        ]

    def create_record(self, record: ConsumptionRecord) -> ConsumptionRecord:
        row = ConsumptionModel(
            date=record.date,
            water_consumption_liters=record.water_consumption_liters,
            energy_consumption_kwh=record.energy_consumption_kwh,
            water_cost=record.water_cost,
            energy_cost=record.energy_cost,
            avg_temperature=record.avg_temperature,
            occupancy_count=record.occupancy_count,
            is_holiday=record.is_holiday,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)

        return ConsumptionRecord(
            date=row.date,
            water_consumption_liters=row.water_consumption_liters,
            energy_consumption_kwh=row.energy_consumption_kwh,
            water_cost=row.water_cost,
            energy_cost=row.energy_cost,
            avg_temperature=row.avg_temperature,
            occupancy_count=row.occupancy_count,
            is_holiday=row.is_holiday,
        )
