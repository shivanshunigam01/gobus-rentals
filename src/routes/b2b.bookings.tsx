import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/b2b/bookings")({
  component: B2BBookings,
});

function B2BBookings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["b2b-bookings"],
    queryFn: () => api<{ bookings: Array<Record<string, string>> }>("/api/b2b/bookings"),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;
  const rows = data?.bookings ?? [];
  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Corporate Bookings</h1>
      <p className="text-muted-foreground text-sm mb-6">All company bookings</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Route</th>
              <th className="px-4 py-3 text-left font-medium">Vendor</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No bookings yet
                </td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{String(b.id).slice(-8)}</td>
                  <td className="px-4 py-3">{b.route}</td>
                  <td className="px-4 py-3">{b.vendor}</td>
                  <td className="px-4 py-3">{b.amount}</td>
                  <td className="px-4 py-3">{b.status}</td>
                  <td className="px-4 py-3">{b.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
