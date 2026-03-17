from sqlalchemy import Date, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ConsumptionModel(Base):
    __tablename__ = "consumption_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    date: Mapped[Date] = mapped_column(Date, unique=True, index=True)
    water_consumption_liters: Mapped[float] = mapped_column(Float)
    energy_consumption_kwh: Mapped[float] = mapped_column(Float)
    water_cost: Mapped[float] = mapped_column(Float)
    energy_cost: Mapped[float] = mapped_column(Float)
    avg_temperature: Mapped[float] = mapped_column(Float)
    occupancy_count: Mapped[int] = mapped_column(Integer)
    is_holiday: Mapped[int] = mapped_column(Integer)
