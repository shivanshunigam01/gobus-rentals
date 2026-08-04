import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/drivers")({
  component: AdminDrivers,
});

function AdminDrivers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-drivers"],
    queryFn: () => api<{ items: Array<Record<string, unknown>>; pagination: { total: number } }>("/api/admin/drivers"),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;
  const rows = data?.items ?? [];
  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold mb-1">Drivers</h1>
      <p className="text-sm text-muted-foreground mb-6">All operator drivers · {data?.pagination?.total ?? rows.length} total</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">License</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Bus</th>
              <th className="px-4 py-3 text-left">Trips</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No drivers yet — vendors can add drivers from their portal
                </td>
              </tr>
            ) : (
              rows.map((d) => (
                <tr key={String(d.id)} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{String(d.name)}</td>
                  <td className="px-4 py-3">{String(d.phone)}</td>
                  <td className="px-4 py-3">{String(d.licenseNumber || "—")}</td>
                  <td className="px-4 py-3 capitalize">{String(d.status)}</td>
                  <td className="px-4 py-3">{String(d.assignedBus || "—")}</td>
                  <td className="px-4 py-3">{String(d.tripCount ?? 0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
