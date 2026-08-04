import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/calendar")({
  component: VendorCalendar,
});

function VendorCalendar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-calendar"],
    queryFn: () =>
      api<{ events: Array<{ id: string; title: string; date: string; status: string }>; buses: Array<{ id: string; name: string }> }>(
        "/api/vendor/calendar",
      ),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold mb-1">Fleet calendar</h1>
      <p className="text-sm text-muted-foreground mb-6">{data?.buses?.length ?? 0} vehicles · upcoming assignments</p>
      <ul className="space-y-2">
        {(data?.events ?? []).length === 0 ? (
          <li className="text-sm text-muted-foreground">No scheduled trips in the next 14 days.</li>
        ) : (
          data!.events.map((e) => (
            <li key={e.id} className="rounded-lg border border-border bg-card px-4 py-3 text-sm flex justify-between gap-2">
              <span>
                <strong>{e.date}</strong> — {e.title}
              </span>
              <span className="capitalize text-muted-foreground">{e.status}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
