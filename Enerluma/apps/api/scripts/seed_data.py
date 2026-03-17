from datetime import date

from app.core.database import SessionLocal
from app.infrastructure.models.consumption_model import ConsumptionModel


def run() -> None:
    db = SessionLocal()
    try:
        existing = db.query(ConsumptionModel).count()
        if existing > 0:
            return

        rows = [
            ConsumptionModel(date=date(2025, 1, 1), water_consumption_liters=11400, energy_consumption_kwh=382, water_cost=620, energy_cost=2860, avg_temperature=23, occupancy_count=4, is_holiday=1),
            ConsumptionModel(date=date(2025, 2, 1), water_consumption_liters=11220, energy_consumption_kwh=371, water_cost=611, energy_cost=2795, avg_temperature=24, occupancy_count=4, is_holiday=0),
            ConsumptionModel(date=date(2025, 3, 1), water_consumption_liters=12020, energy_consumption_kwh=398, water_cost=653, energy_cost=3008, avg_temperature=27, occupancy_count=4, is_holiday=0),
            ConsumptionModel(date=date(2025, 4, 1), water_consumption_liters=12590, energy_consumption_kwh=420, water_cost=683, energy_cost=3152, avg_temperature=30, occupancy_count=4, is_holiday=0),
            ConsumptionModel(date=date(2025, 5, 1), water_consumption_liters=13380, energy_consumption_kwh=446, water_cost=726, energy_cost=3359, avg_temperature=33, occupancy_count=4, is_holiday=0),
            ConsumptionModel(date=date(2025, 6, 1), water_consumption_liters=14240, energy_consumption_kwh=475, water_cost=775, energy_cost=3588, avg_temperature=35, occupancy_count=4, is_holiday=0),
        ]
        db.add_all(rows)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    run()
