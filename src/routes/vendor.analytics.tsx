import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/analytics")({
  component: VendorAnalytics,
});

function VendorAnalytics() {
  const baseQ = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: () => api<{ stats: Record<string, unknown>; recentTransactions: Array<Record<string, string>> }>("/api/vendor/analytics"),
  });
  const deepQ = useQuery({
    queryKey: ["vendor-analytics-deep"],
    queryFn: () =>
      api<{
        summary: { bookings: number; quotes: number; earnings: number; fleet: number };
        revenueSeries: Array<{ date: string; revenue: number }>;
        fleetUtilization: Array<{ name: string; trips: number }>;
      }>("/api/vendor/analytics/deep?days=30"),
  });

  if (baseQ.isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading analytics…</div>;
  const s = baseQ.data?.stats || {};
  const deep = deepQ.data;

  const cards = [
    { label: "Bookings", value: s.totalBookings ?? deep?.summary?.bookings ?? 0 },
    { label: "Completed", value: s.completedBookings ?? 0 },
    { label: "Quotes sent", value: s.quotesSent ?? deep?.summary?.quotes ?? 0 },
    { label: "Fleet", value: s.fleetCount ?? deep?.summary?.fleet ?? 0 },
    { label: "Approved fleet", value: s.approvedFleet ?? 0 },
    { label: "Revenue", value: s.revenueDisplay || `₹${Number(deep?.summary?.earnings || 0).toLocaleString("en-IN")}` },
  ];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold mb-1">Analytics</h1>
      <p className="text-sm text-muted-foreground mb-6">Bookings, earnings, and fleet utilization</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="border border-border rounded-xl p-4 bg-card">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{String(c.value)}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold mb-3">Earnings (30 days)</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={deep?.revenueSeries ?? []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Fleet utilization</h2>
      <ul className="mb-8 space-y-2 text-sm">
        {(deep?.fleetUtilization ?? []).map((f) => (
          <li key={f.name} className="flex justify-between rounded-lg border border-border bg-card px-3 py-2">
            <span>{f.name}</span>
            <span className="text-muted-foreground">{f.trips} trips</span>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-3">Recent wallet activity</h2>
      <div className="space-y-2">
        {(baseQ.data?.recentTransactions || []).map((t) => (
          <div key={t.id} className="border border-border rounded-lg p-3 flex justify-between text-sm bg-card">
            <span className="capitalize">{t.type}</span>
            <span>{t.amountDisplay}</span>
          </div>
        ))}
        {!baseQ.data?.recentTransactions?.length && (
          <p className="text-sm text-muted-foreground">No wallet activity yet.</p>
        )}
      </div>
    </div>
  );
}
