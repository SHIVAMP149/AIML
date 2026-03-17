type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-panel">
      <p className="text-sm font-medium text-slate/70">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-ink">{value}</h3>
      <p className="mt-1 text-sm text-slate/70">{subtitle}</p>
    </article>
  );
}
