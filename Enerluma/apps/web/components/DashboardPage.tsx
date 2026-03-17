"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";

import { clearToken, getStoredToken } from "@/lib/auth";
import { fetchConsumption, fetchDashboardSummary, fetchInsights, fetchMe } from "@/lib/api";
import { MetricCard } from "@/components/MetricCard";

type Summary = Awaited<ReturnType<typeof fetchDashboardSummary>>;
type RecordList = Awaited<ReturnType<typeof fetchConsumption>>;
type Insights = Awaited<ReturnType<typeof fetchInsights>>;
type Me = Awaited<ReturnType<typeof fetchMe>>;

export function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [records, setRecords] = useState<RecordList>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetchMe(token),
      fetchDashboardSummary(token),
      fetchConsumption(token),
      fetchInsights(token),
    ])
      .then(([user, summaryData, recordData, insightData]) => {
        setMe(user);
        setSummary(summaryData);
        setRecords(recordData);
        setInsights(insightData);
      })
      .catch((err) => {
        clearToken();
        setError(err instanceof Error ? err.message : "Unable to load dashboard");
        router.push("/login");
      });
  }, [router]);

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

  const recent = records.slice(-6).reverse();

  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl glass px-6 py-4 shadow-panel">
          <div>
            <p className="text-sm font-semibold text-ocean">Enerluma Analytics Center</p>
            <h1 className="mt-1 text-3xl font-bold text-ink">Dashboard</h1>
            <p className="mt-1 text-sm text-slate/75">Signed in as {me?.full_name || "User"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                clearToken();
                router.push("/login");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate/20 bg-white px-4 py-2 text-sm font-semibold text-slate transition hover:bg-mist"
            >
              Logout
            </button>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate">
              <ArrowLeft className="h-4 w-4" /> Back to Landing
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Average Water" value={`${summary.avg_water_liters} L`} subtitle="Historical mean" />
          <MetricCard title="Average Energy" value={`${summary.avg_energy_kwh} kWh`} subtitle="Historical mean" />
          <MetricCard title="Average Total Cost" value={`${summary.avg_total_cost}`} subtitle="Water + energy" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Forecast Water" value={`${insights.forecast.water_next} L`} subtitle="Next period estimate" />
          <MetricCard title="Forecast Energy" value={`${insights.forecast.energy_next} kWh`} subtitle="Next period estimate" />
          <MetricCard title="Forecast Cost" value={`${insights.forecast.cost_next}`} subtitle={`Risk: ${insights.anomaly.risk_level}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ocean" />
              <h2 className="text-xl font-semibold">Recent Consumption History</h2>
            </div>
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
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-ocean" />
              <h2 className="text-xl font-semibold">Latest Snapshot</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate/80">
              <p>Records tracked: <span className="font-semibold text-ink">{summary.total_records}</span></p>
              <p>Latest water: <span className="font-semibold text-ink">{summary.latest_water_liters} L</span></p>
              <p>Latest energy: <span className="font-semibold text-ink">{summary.latest_energy_kwh} kWh</span></p>
              <p>Latest total cost: <span className="font-semibold text-ink">{summary.latest_total_cost}</span></p>
            </div>
            <div className="mt-6 rounded-xl bg-mist p-4 text-sm text-slate/80">
              <p className="font-semibold text-ink">Recommendations</p>
              <ul className="mt-2 list-disc pl-4">
                {insights.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
