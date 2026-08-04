import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendar,
});

function AdminCalendar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-calendar"],
    queryFn: () =>
      api<{
        events: Array<{ id: string; title: string; date: string; status: string; driver?: string }>;
        buses: Array<{ id: string; name: string; type?: string }>;
      }>("/api/admin/calendar"),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  type Ev = { id: string; title: string; date: string; status: string; driver?: string };
  const byDate: Record<string, Ev[]> = {};
  for (const e of data?.events ?? []) {
    (byDate[e.date] ||= []).push(e);
  }

  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold mb-1">Trip calendar</h1>
      <p className="text-sm text-muted-foreground mb-6">Scheduled trips & vehicle availability</p>
      <div className="mb-4 text-sm text-muted-foreground">{data?.buses?.length ?? 0} buses tracked</div>
      <div className="space-y-3">
        {Object.keys(byDate).length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming scheduled trips in range.</p>
        ) : (
          Object.entries(byDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, events]) => (
              <div key={date} className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-2 font-medium">{date}</h2>
                <ul className="space-y-2 text-sm">
                  {events.map((e) => (
                    <li key={e.id} className="flex flex-wrap justify-between gap-2 border-b border-border pb-2 last:border-0">
                      <span>{e.title}</span>
                      <span className="text-muted-foreground capitalize">
                        {e.status}
                        {e.driver ? ` · ${e.driver}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
