import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-panel">
        <h1 className="text-3xl font-bold text-ink">About the Project</h1>
        <p className="mt-4 text-slate/80">
          Enerluma is a smart energy and water consumption platform that combines clean-architecture APIs, secure access,
          and AI-driven forecasting for sustainable operations.
        </p>
        <p className="mt-3 text-slate/80">
          The system includes prediction models for consumption and cost, anomaly detection for wastage and leakage risk,
          and operational recommendations for reduction strategies.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-xl border border-slate/20 px-4 py-2 text-sm font-semibold text-slate">
            Back to Landing
          </Link>
          <Link href="/dashboard" className="rounded-xl bg-ocean px-4 py-2 text-sm font-semibold text-white">
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
