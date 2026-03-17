const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function buildAuthHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type DashboardSummary = {
  total_records: number;
  avg_water_liters: number;
  avg_energy_kwh: number;
  avg_total_cost: number;
  latest_water_liters: number;
  latest_energy_kwh: number;
  latest_total_cost: number;
};

type ConsumptionRecord = {
  date: string;
  water_consumption_liters: number;
  energy_consumption_kwh: number;
  water_cost: number;
  energy_cost: number;
  avg_temperature: number;
  occupancy_count: number;
  is_holiday: number;
};

type InsightsResponse = {
  forecast: {
    water_next: number;
    energy_next: number;
    cost_next: number;
  };
  anomaly: {
    high_water: boolean;
    high_energy: boolean;
    risk_level: string;
  };
  recommendations: string[];
};

export async function fetchDashboardSummary(token: string): Promise<DashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/summary`, {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error("Failed to load summary");
  }
  return res.json();
}

export async function fetchConsumption(token: string): Promise<ConsumptionRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/consumption`, {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error("Failed to load consumption data");
  }
  return res.json();
}

export async function fetchInsights(token: string): Promise<InsightsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/insights`, {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error("Failed to load platform insights");
  }
  return res.json();
}

export async function fetchMe(token: string): Promise<{ id: number; email: string; full_name: string }> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error("Session expired");
  }
  return res.json();
}
