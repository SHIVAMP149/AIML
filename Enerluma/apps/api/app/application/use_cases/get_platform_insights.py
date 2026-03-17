from __future__ import annotations

import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestRegressor

from app.domain.repositories.consumption_repository import ConsumptionRepository
from app.infrastructure.ml.model_store import ModelStore


class GetPlatformInsightsUseCase:
    def __init__(self, repository: ConsumptionRepository):
        self.repository = repository
        self.model_store = ModelStore()

    def execute(self) -> dict:
        rows = self.repository.list_records()

        if len(rows) < 6:
            return {
                "forecast": {"water_next": 0, "energy_next": 0, "cost_next": 0},
                "anomaly": {"high_water": False, "high_energy": False, "risk_level": "low"},
                "recommendations": ["Add at least 6 historical records to enable ML-driven forecasting and anomaly insights."],
            }

        x_features: list[list[float]] = []
        y_water: list[float] = []
        y_energy: list[float] = []
        y_cost: list[float] = []

        for idx, row in enumerate(rows):
            month = float(row.date.month)
            year = float(row.date.year)
            x_features.append([
                float(idx),
                month,
                year,
                float(row.avg_temperature),
                float(row.occupancy_count),
                float(row.is_holiday),
            ])
            y_water.append(float(row.water_consumption_liters))
            y_energy.append(float(row.energy_consumption_kwh))
            y_cost.append(float(row.water_cost + row.energy_cost))

        x_np = np.array(x_features, dtype=float)
        water_np = np.array(y_water, dtype=float)
        energy_np = np.array(y_energy, dtype=float)
        cost_np = np.array(y_cost, dtype=float)

        signature = self.model_store.build_signature(rows)
        cached_models = self.model_store.load_if_valid(signature)

        if cached_models is None:
            water_model = RandomForestRegressor(n_estimators=200, random_state=42, min_samples_leaf=1)
            energy_model = RandomForestRegressor(n_estimators=200, random_state=42, min_samples_leaf=1)
            cost_model = RandomForestRegressor(n_estimators=200, random_state=42, min_samples_leaf=1)

            water_model.fit(x_np, water_np)
            energy_model.fit(x_np, energy_np)
            cost_model.fit(x_np, cost_np)

            anomaly_matrix = np.column_stack([water_np, energy_np, cost_np])
            detector = IsolationForest(n_estimators=200, contamination=0.15, random_state=42)
            detector.fit(anomaly_matrix)

            cached_models = {
                "water_model": water_model,
                "energy_model": energy_model,
                "cost_model": cost_model,
                "anomaly_model": detector,
            }
            self.model_store.save(signature, cached_models)

        water_model = cached_models["water_model"]
        energy_model = cached_models["energy_model"]
        cost_model = cached_models["cost_model"]
        detector = cached_models["anomaly_model"]

        latest = rows[-1]

        next_index = float(len(rows))
        next_month = float((latest.date.month % 12) + 1)
        next_year = float(latest.date.year + 1 if latest.date.month == 12 else latest.date.year)

        x_next = np.array(
            [[next_index, next_month, next_year, float(latest.avg_temperature), float(latest.occupancy_count), 0.0]],
            dtype=float,
        )

        next_water = float(max(water_model.predict(x_next)[0], 0.0))
        next_energy = float(max(energy_model.predict(x_next)[0], 0.0))
        next_cost = float(max(cost_model.predict(x_next)[0], 0.0))

        forecast = {
            "water_next": round(next_water, 2),
            "energy_next": round(next_energy, 2),
            "cost_next": round(next_cost, 2),
        }

        anomaly_matrix = np.column_stack([water_np, energy_np, cost_np])
        anomaly_flags = detector.predict(anomaly_matrix)

        latest_is_anomaly = anomaly_flags[-1] == -1

        avg_water = float(np.mean(water_np))
        avg_energy = float(np.mean(energy_np))

        high_water = latest.water_consumption_liters > avg_water * 1.2
        high_energy = latest.energy_consumption_kwh > avg_energy * 1.2

        if (high_water and high_energy) or latest_is_anomaly:
            risk_level = "high"
        elif high_water or high_energy:
            risk_level = "medium"
        else:
            risk_level = "low"

        recommendations: list[str] = []
        if high_water:
            recommendations.append("Water usage is above baseline. Run a fixture leakage check and prioritize low-flow usage windows.")
        if high_energy:
            recommendations.append("Energy usage is above baseline. Move high-load devices away from peak tariff hours.")
        if latest_is_anomaly:
            recommendations.append("Latest cycle is flagged as anomalous by ML detector. Validate meter logs and inspect unusual activities.")
        if risk_level == "low":
            recommendations.append("System looks stable. Maintain current usage pattern and review trends weekly.")

        return {
            "forecast": forecast,
            "anomaly": {
                "high_water": high_water,
                "high_energy": high_energy,
                "risk_level": risk_level,
            },
            "recommendations": recommendations,
        }
