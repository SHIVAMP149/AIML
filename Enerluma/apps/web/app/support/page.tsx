import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-panel">
        <h1 className="text-3xl font-bold text-ink">Contact / Support</h1>
        <p className="mt-4 text-slate/80">
          Need help with smart monitoring, anomaly interpretation, or dashboard operations? Reach the support team at
          <span className="font-semibold"> support@enerluma.local</span>.
        </p>
        <p className="mt-3 text-slate/80">
          For urgent operational incidents, include the date range, user account, and affected module (energy, water,
          analytics, or alerts).
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-xl border border-slate/20 px-4 py-2 text-sm font-semibold text-slate">
            Back to Landing
          </Link>
          <Link href="/dashboard" className="rounded-xl bg-ocean px-4 py-2 text-sm font-semibold text-white">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
