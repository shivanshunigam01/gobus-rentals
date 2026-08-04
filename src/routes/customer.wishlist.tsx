import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/customer/wishlist")({
  component: CustomerWishlist,
});

function CustomerWishlist() {
  const qc = useQueryClient();
  const [slug, setSlug] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => api<{ items: Array<{ id: string; label: string; vehicleTypeSlug: string }> }>("/api/customer/wishlist"),
  });
  const add = useMutation({
    mutationFn: () => api("/api/customer/wishlist", { method: "POST", body: JSON.stringify({ vehicleTypeSlug: slug, label: slug }) }),
    onSuccess: () => {
      toast.success("Saved to wishlist");
      setSlug("");
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/customer/wishlist/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold mb-1">Wishlist</h1>
      <p className="text-sm text-muted-foreground mb-6">Save vehicle types you prefer</p>
      <div className="mb-4 flex gap-2">
        <Input placeholder="e.g. urbania" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Button type="button" disabled={!slug || add.isPending} onClick={() => add.mutate()}>
          Add
        </Button>
      </div>
      <ul className="space-y-2">
        {(data?.items ?? []).map((i) => (
          <li key={i.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <span>{i.label || i.vehicleTypeSlug}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => remove.mutate(i.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
