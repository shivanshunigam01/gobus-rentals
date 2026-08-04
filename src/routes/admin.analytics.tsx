import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

type Analytics = {
  days: number;
  summary: {
    bookings: number;
    leads: number;
    quotes: number;
    customers: number;
    vendors: number;
    activeVendors: number;
    fleet: number;
    grossRevenueDisplay: string;
    collectedDisplay: string;
    conversionRate: number;
  };
  revenueSeries: Array<{ date: string; revenue: number }>;
  bookingSeries: Array<{ date: string; bookings: number }>;
  leadSeries: Array<{ date: string; leads: number }>;
  bookingStatus: Array<{ status: string; count: number }>;
  topVendors: Array<{ vendor: string; revenueDisplay: string; revenue: number }>;
  fleetByType: Array<{ type: string; count: number }>;
};

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function AdminAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => api<Analytics>("/api/admin/analytics?days=30"),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading analytics…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;
  const s = data?.summary;

  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Platform Analytics</h1>
      <p className="text-muted-foreground text-sm mb-6">Revenue, bookings, leads, fleet & vendor performance ({data?.days} days)</p>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Gross revenue", s?.grossRevenueDisplay],
          ["Collected", s?.collectedDisplay],
          ["Bookings", String(s?.bookings ?? 0)],
          ["Lead → book %", `${s?.conversionRate ?? 0}%`],
          ["Leads", String(s?.leads ?? 0)],
          ["Quotes", String(s?.quotes ?? 0)],
          ["Active vendors", String(s?.activeVendors ?? 0)],
          ["Fleet", String(s?.fleet ?? 0)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-display text-lg font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-medium">Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.revenueSeries ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-medium">Bookings vs leads</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(data?.bookingSeries ?? []).map((b, i) => ({
                  date: b.date,
                  bookings: b.bookings,
                  leads: data?.leadSeries?.[i]?.leads ?? 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="var(--color-chart-2)" />
                <Bar dataKey="leads" fill="var(--color-chart-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-medium">Booking status</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.bookingStatus ?? []} dataKey="count" nameKey="status" outerRadius={90} label>
                  {(data?.bookingStatus ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 font-medium">Top vendors</h2>
          <ul className="space-y-2 text-sm">
            {(data?.topVendors ?? []).map((v) => (
              <li key={v.vendor} className="flex justify-between border-b border-border py-2 last:border-0">
                <span>{v.vendor}</span>
                <span className="font-medium">{v.revenueDisplay}</span>
              </li>
            ))}
          </ul>
          <h2 className="mb-2 mt-4 font-medium">Fleet mix</h2>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {(data?.fleetByType ?? []).map((f) => (
              <li key={f.type}>
                {f.type}: {f.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
