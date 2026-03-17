"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { clearToken, getStoredToken } from "@/lib/auth";
import { ConsumptionRecord, fetchConsumption, fetchDashboardSummary, fetchInsights, fetchMe } from "@/lib/api";
import { MetricCard } from "@/components/MetricCard";

type SectionKey =
  | "dashboard"
  | "energy"
  | "water"
  | "ai"
  | "analytics"
  | "alerts"
  | "recommendations"
  | "profile"
  | "settings"
  | "admin";

type WorkspaceSectionPageProps = {
  title: string;
  description: string;
  section: SectionKey;
};

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/energy-monitoring", label: "Energy" },
  { href: "/water-monitoring", label: "Water" },
  { href: "/ai-prediction", label: "AI Prediction" },
  { href: "/analytics", label: "Analytics" },
  { href: "/alerts", label: "Alerts" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
  { href: "/admin", label: "Admin" },
];

type ChartPoint = {
  label: string;
  value: number;
};

function toChartPoints(records: ConsumptionRecord[], key: "water_consumption_liters" | "energy_consumption_kwh"): ChartPoint[] {
  return records.slice(-7).map((record) => ({
    label: record.date.slice(5),
    value: record[key],
  }));
}

function MiniBars({ points, unit }: { points: ChartPoint[]; unit: string }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div className="space-y-2">
      {points.map((point) => (
        <div key={point.label}>
          <div className="mb-1 flex justify-between text-xs text-slate/70">
            <span>{point.label}</span>
            <span>
              {point.value} {unit}
            </span>
          </div>
          <div className="h-2 rounded bg-mist">
            <div className="h-2 rounded bg-ocean" style={{ width: `${(point.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkspaceSectionPage({ title, description, section }: WorkspaceSectionPageProps) {
  const router = useRouter();
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof fetchDashboardSummary>> | null>(null);
  const [records, setRecords] = useState<ConsumptionRecord[]>([]);
  const [insights, setInsights] = useState<Awaited<ReturnType<typeof fetchInsights>> | null>(null);
  const [me, setMe] = useState<Awaited<ReturnType<typeof fetchMe>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([fetchMe(token), fetchDashboardSummary(token), fetchConsumption(token), fetchInsights(token)])
      .then(([user, summaryData, recordData, insightData]) => {
        setMe(user);
        setSummary(summaryData);
        setRecords(recordData);
        setInsights(insightData);
      })
      .catch((err) => {
        clearToken();
        setError(err instanceof Error ? err.message : "Unable to load workspace");
        router.push("/login");
      });
  }, [router]);

  const waterPoints = useMemo(() => toChartPoints(records, "water_consumption_liters"), [records]);
  const energyPoints = useMemo(() => toChartPoints(records, "energy_consumption_kwh"), [records]);
  const recent = useMemo(() => records.slice(-6).reverse(), [records]);

  if (!summary || !insights) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="rounded-2xl bg-white px-6 py-4 shadow-panel">
          <p className="text-slate/80">Loading your Enerluma workspace...</p>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-2xl glass px-6 py-4 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ocean">Enerluma Analytics Center</p>
              <h1 className="mt-1 text-3xl font-bold text-ink">{title}</h1>
              <p className="mt-1 text-sm text-slate/75">{description}</p>
              <p className="mt-1 text-xs text-slate/70">Signed in as {me?.full_name || "User"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded-full border border-slate/20 bg-white px-4 py-2 text-sm font-semibold text-slate">
                Landing
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearToken();
                  router.push("/login");
                }}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {workspaceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.href.includes(section) || (section === "dashboard" && item.href === "/dashboard") ? "bg-ocean text-white" : "bg-white text-slate"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {(section === "dashboard" || section === "energy" || section === "water") && (
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard title="Average Water" value={`${summary.avg_water_liters} L`} subtitle="Historical mean" />
            <MetricCard title="Average Energy" value={`${summary.avg_energy_kwh} kWh`} subtitle="Historical mean" />
            <MetricCard title="Average Cost" value={`${summary.avg_total_cost}`} subtitle="Water + energy" />
          </section>
        )}

        {(section === "dashboard" || section === "ai") && (
          <section className="grid gap-4 md:grid-cols-3">
            <MetricCard title="Forecast Water" value={`${insights.forecast.water_next} L`} subtitle="Next period estimate" />
            <MetricCard title="Forecast Energy" value={`${insights.forecast.energy_next} kWh`} subtitle="Next period estimate" />
            <MetricCard title="Forecast Cost" value={`${insights.forecast.cost_next}`} subtitle={`Risk: ${insights.anomaly.risk_level}`} />
          </section>
        )}

        {(section === "analytics" || section === "dashboard" || section === "energy" || section === "water") && (
          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-white p-5 shadow-panel">
              <h2 className="text-lg font-semibold">Daily Water Trend (Last 7)</h2>
              <div className="mt-4">
                <MiniBars points={waterPoints} unit="L" />
              </div>
            </article>
            <article className="rounded-2xl bg-white p-5 shadow-panel">
              <h2 className="text-lg font-semibold">Daily Energy Trend (Last 7)</h2>
              <div className="mt-4">
                <MiniBars points={energyPoints} unit="kWh" />
              </div>
            </article>
          </section>
        )}

        {(section === "alerts" || section === "dashboard") && (
          <section className="rounded-2xl bg-white p-5 shadow-panel">
            <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-slate/80">
              <li>{insights.anomaly.high_energy ? "High energy consumption detected." : "Energy usage is in expected range."}</li>
              <li>{insights.anomaly.high_water ? "High water usage detected." : "Water usage is in expected range."}</li>
              <li>{insights.anomaly.risk_level === "high" ? "Possible abnormal consumption pattern detected." : "No critical anomalies detected."}</li>
              <li>{insights.anomaly.high_water && insights.anomaly.risk_level !== "low" ? "Potential leakage risk. Check fixtures and overnight baseline." : "Leakage risk currently low."}</li>
            </ul>
          </section>
        )}

        {(section === "recommendations" || section === "dashboard") && (
          <section className="rounded-2xl bg-white p-5 shadow-panel">
            <h2 className="text-xl font-semibold">Smart Recommendations</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-slate/80">
              {insights.recommendations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {section === "profile" && (
          <section className="rounded-2xl bg-white p-5 shadow-panel text-sm text-slate/80">
            <h2 className="text-xl font-semibold text-ink">User Profile</h2>
            <p className="mt-3">Name: <span className="font-semibold text-ink">{me?.full_name}</span></p>
            <p>Email: <span className="font-semibold text-ink">{me?.email}</span></p>
            <p>Total records tracked: <span className="font-semibold text-ink">{summary.total_records}</span></p>
          </section>
        )}

        {section === "settings" && (
          <section className="rounded-2xl bg-white p-5 shadow-panel text-sm text-slate/80">
            <h2 className="text-xl font-semibold text-ink">Settings</h2>
            <ul className="mt-3 list-disc space-y-1 pl-4">
              <li>Alert threshold baseline: 1.2x historical mean</li>
              <li>AI forecast model: Random Forest (auto-refresh on data changes)</li>
              <li>Notification mode: in-dashboard alerts</li>
            </ul>
          </section>
        )}

        {section === "admin" && (
          <section className="rounded-2xl bg-white p-5 shadow-panel text-sm text-slate/80">
            <h2 className="text-xl font-semibold text-ink">Admin Panel</h2>
            <p className="mt-3">System status: Active</p>
            <p>Tracked records: {summary.total_records}</p>
            <p>Current risk level: {insights.anomaly.risk_level}</p>
          </section>
        )}

        {(section === "dashboard" || section === "analytics") && (
          <section className="rounded-2xl bg-white p-5 shadow-panel">
            <h2 className="text-xl font-semibold">Recent Consumption History</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate/10 text-slate/70">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Water (L)</th>
                    <th className="py-2 pr-4">Energy (kWh)</th>
                    <th className="py-2">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.date} className="border-b border-slate/5">
                      <td className="py-2 pr-4">{r.date}</td>
                      <td className="py-2 pr-4">{r.water_consumption_liters}</td>
                      <td className="py-2 pr-4">{r.energy_consumption_kwh}</td>
                      <td className="py-2">{(r.water_cost + r.energy_cost).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
