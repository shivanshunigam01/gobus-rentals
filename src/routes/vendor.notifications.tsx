import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/notifications")({
  component: VendorNotifications,
});

function VendorNotifications() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-notifications"],
    queryFn: () => api<{ items: any[] }>("/api/vendor/notifications"),
  });

  if (isLoading) return <div className={panelStatePadding}>Loading…</div>;

  return (
    <div className={panelPage}>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-2">
        {(data?.items || []).length === 0 && (
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        )}
        {(data?.items || []).map((n) => (
          <div key={n.id} className="border rounded-lg p-4 bg-card">
            <div className="flex justify-between gap-2">
              <p className="font-medium">{n.subject}</p>
              <span className="text-xs text-muted-foreground capitalize">{n.channel}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{n.body}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {n.date ? new Date(n.date).toLocaleString("en-IN") : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
