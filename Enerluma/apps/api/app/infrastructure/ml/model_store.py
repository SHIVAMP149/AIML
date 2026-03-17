from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

import joblib


class ModelStore:
    def __init__(self, base_dir: Path | None = None):
        root = base_dir or Path("artifacts") / "ml"
        self.base_dir = root
        self.base_dir.mkdir(parents=True, exist_ok=True)

        self.water_path = self.base_dir / "water_model.joblib"
        self.energy_path = self.base_dir / "energy_model.joblib"
        self.cost_path = self.base_dir / "cost_model.joblib"
        self.anomaly_path = self.base_dir / "anomaly_model.joblib"
        self.meta_path = self.base_dir / "metadata.json"

    def build_signature(self, rows: list[Any]) -> str:
        payload = [
            {
                "date": r.date.isoformat(),
                "water": float(r.water_consumption_liters),
                "energy": float(r.energy_consumption_kwh),
                "water_cost": float(r.water_cost),
                "energy_cost": float(r.energy_cost),
                "temp": float(r.avg_temperature),
                "occupancy": int(r.occupancy_count),
                "holiday": int(r.is_holiday),
            }
            for r in rows
        ]
        canonical = json.dumps(payload, separators=(",", ":"), sort_keys=True)
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    def load_if_valid(self, signature: str) -> dict[str, Any] | None:
        if not self.meta_path.exists():
            return None
        if not all(path.exists() for path in [self.water_path, self.energy_path, self.cost_path, self.anomaly_path]):
            return None

        meta = json.loads(self.meta_path.read_text(encoding="utf-8"))
        if meta.get("signature") != signature:
            return None

        return {
            "water_model": joblib.load(self.water_path),
            "energy_model": joblib.load(self.energy_path),
            "cost_model": joblib.load(self.cost_path),
            "anomaly_model": joblib.load(self.anomaly_path),
        }

    def save(self, signature: str, models: dict[str, Any]) -> None:
        joblib.dump(models["water_model"], self.water_path)
        joblib.dump(models["energy_model"], self.energy_path)
        joblib.dump(models["cost_model"], self.cost_path)
        joblib.dump(models["anomaly_model"], self.anomaly_path)

        meta = {
            "signature": signature,
            "version": 1,
        }
        self.meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
