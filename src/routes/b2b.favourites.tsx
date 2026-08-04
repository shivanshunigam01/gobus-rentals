import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/b2b/favourites")({
  component: B2BFavourites,
});

function B2BFavourites() {
  const qc = useQueryClient();
  const [slug, setSlug] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["b2b-favourites"],
    queryFn: () => api<{ favourites: Array<{ id: string; vehicleTypeSlug: string; label: string }> }>("/api/b2b/favourites"),
  });
  const add = useMutation({
    mutationFn: () =>
      api("/api/b2b/favourites", {
        method: "POST",
        body: JSON.stringify({ vehicleTypeSlug: slug, label: slug }),
      }),
    onSuccess: () => {
      toast.success("Added");
      setSlug("");
      qc.invalidateQueries({ queryKey: ["b2b-favourites"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/b2b/favourites/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["b2b-favourites"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Favourite Vehicles</h1>
      <p className="text-muted-foreground text-sm mb-6">Save preferred vehicle types for quick booking</p>
      <div className="mb-6 flex gap-2">
        <Input placeholder="vehicle-type-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Button type="button" disabled={!slug || add.isPending} onClick={() => add.mutate()}>
          Add
        </Button>
      </div>
      <ul className="space-y-2">
        {(data?.favourites ?? []).map((f) => (
          <li key={f.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <span>{f.label || f.vehicleTypeSlug}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => remove.mutate(f.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
