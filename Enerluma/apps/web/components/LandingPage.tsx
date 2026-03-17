import Link from "next/link";
import { Activity, ArrowRight, Droplet, ShieldCheck, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: Droplet,
    title: "Water Intelligence",
    body: "Identify unusual spikes, compare seasonal baselines, and surface likely leakage patterns.",
  },
  {
    icon: Zap,
    title: "Energy Optimization",
    body: "Forecast peak-demand periods and produce practical recommendations to reduce consumption.",
  },
  {
    icon: Activity,
    title: "AI Forecast Engine",
    body: "Predict future usage and cost with transparent model metrics and confidence indicators.",
  },
  {
    icon: ShieldCheck,
    title: "Operations Ready",
    body: "Clean architecture, API versioning, and scalable service boundaries for long-term maintainability.",
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="hero-grid px-6 pb-16 pt-10 md:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <header className="flex items-center justify-between rounded-2xl glass px-6 py-4 shadow-panel">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-ocean" />
              <span className="text-lg font-semibold">Enerluma</span>
            </div>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate">
              Login <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-ocean/15 px-4 py-2 text-sm font-semibold text-ocean">
                Sustainable Intelligence Platform
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                The 10-year-grade utility platform for <span className="text-ocean">smart water and energy decisions</span>.
              </h1>
              <p className="max-w-2xl text-lg text-slate/80">
                Enerluma blends forecasting, anomaly detection, and operations analytics into one modern experience from landing to dashboard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
                  Access Secure Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#features" className="inline-flex items-center rounded-xl border border-slate/20 px-5 py-3 text-sm font-semibold text-slate transition hover:bg-white/80">
                  View Capabilities
                </a>
              </div>
            </div>

            <aside className="rounded-3xl glass p-6 shadow-panel">
              <h2 className="text-xl font-semibold">Platform Snapshot</h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="rounded-xl bg-white/80 p-4">
                  <p className="text-slate/70">Forecast Accuracy Target</p>
                  <p className="mt-1 text-2xl font-bold text-ink">MAPE &lt; 15%</p>
                </div>
                <div className="rounded-xl bg-white/80 p-4">
                  <p className="text-slate/70">Anomaly Detection</p>
                  <p className="mt-1 text-2xl font-bold text-ink">Leak &amp; spike alerts</p>
                </div>
                <div className="rounded-xl bg-white/80 p-4">
                  <p className="text-slate/70">Cost Reduction Goal</p>
                  <p className="mt-1 text-2xl font-bold text-ink">10-20% savings</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-16 md:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-2">
          {features.map((item) => (
            <article key={item.title} className="rounded-2xl bg-white p-6 shadow-panel">
              <item.icon className="h-6 w-6 text-ocean" />
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-slate/80">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
