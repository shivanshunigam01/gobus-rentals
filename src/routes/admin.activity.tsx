import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/activity")({
  component: AdminActivity,
});

function AdminActivity() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: () =>
      api<{ items: Array<{ id: string; bookingId: string; type: string; message: string; createdAt?: string }> }>(
        "/api/admin/activity",
      ),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold mb-1">Activity timeline</h1>
      <p className="text-sm text-muted-foreground mb-6">Cross-booking events (status, payment, driver, trip)</p>
      <ol className="relative space-y-4 border-l border-border pl-5">
        {(data?.items ?? []).map((e) => (
          <li key={e.id}>
            <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
            <p className="font-medium text-sm">{e.message}</p>
            <p className="text-[11px] text-muted-foreground">
              {e.type} · booking …{e.bookingId.slice(-8)}
              {e.createdAt ? ` · ${new Date(e.createdAt).toLocaleString("en-IN")}` : ""}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
