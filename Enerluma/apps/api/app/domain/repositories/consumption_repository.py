from __future__ import annotations

from abc import ABC, abstractmethod

from app.domain.entities.consumption import ConsumptionRecord


class ConsumptionRepository(ABC):
    @abstractmethod
    def list_records(self) -> list[ConsumptionRecord]:
        raise NotImplementedError

    @abstractmethod
    def create_record(self, record: ConsumptionRecord) -> ConsumptionRecord:
        raise NotImplementedError
