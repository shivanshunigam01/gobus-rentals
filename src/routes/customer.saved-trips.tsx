import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/customer/saved-trips")({
  component: CustomerSavedTrips,
});

function CustomerSavedTrips() {
  const qc = useQueryClient();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["saved-trips"],
    queryFn: () =>
      api<{ trips: Array<{ id: string; title: string; pickup: string; drop: string; distanceKm: number }> }>(
        "/api/customer/saved-trips",
      ),
  });
  const save = useMutation({
    mutationFn: () => api("/api/customer/saved-trips", { method: "POST", body: JSON.stringify({ pickup, drop }) }),
    onSuccess: (res: { distanceKm?: number }) => {
      toast.success(res.distanceKm ? `Saved · ~${res.distanceKm} km` : "Trip saved");
      setPickup("");
      setDrop("");
      qc.invalidateQueries({ queryKey: ["saved-trips"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/customer/saved-trips/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["saved-trips"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold mb-1">Saved trips</h1>
      <p className="text-sm text-muted-foreground mb-6">Store routes with live distance estimation</p>
      <div className="mb-6 space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="space-y-1">
          <Label>Pickup</Label>
          <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Delhi" />
        </div>
        <div className="space-y-1">
          <Label>Drop</Label>
          <Input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Jaipur" />
        </div>
        <Button type="button" disabled={!pickup || !drop || save.isPending} onClick={() => save.mutate()}>
          Save trip
        </Button>
      </div>
      <ul className="space-y-2">
        {(data?.trips ?? []).map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <div>
              <p className="font-medium">
                {t.pickup} → {t.drop}
              </p>
              <p className="text-xs text-muted-foreground">{t.distanceKm ? `${t.distanceKm} km` : "Distance pending"}</p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => remove.mutate(t.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
