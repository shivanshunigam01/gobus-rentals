import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { getToken } from "@/lib/auth-storage";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

type Offer = {
  id: string;
  title: string;
  slug: string;
  type: string;
  code: string;
  discountType: string;
  discountValue: number;
  status: string;
  target: string;
  priority: number;
  href: string;
  description: string;
  startsAt?: string;
  expiresAt?: string;
};

function AdminOffers() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "banner",
    code: "",
    discountType: "percent",
    discountValue: "10",
    status: "active",
    target: "all",
    priority: "100",
    href: "/book",
    description: "",
    startsAt: "",
    expiresAt: "",
  });
  const [banner, setBanner] = useState<File | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: () => api<{ offers: Offer[] }>("/api/admin/offers"),
  });

  const save = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (banner) fd.append("banner", banner);
      const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${base}/api/admin/offers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken() || ""}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      return json;
    },
    onSuccess: () => {
      toast.success("Offer created");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-offers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => api(`/api/admin/offers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-offers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.wide}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Offers CMS</h1>
          <p className="text-sm text-muted-foreground">Homepage banners and coupon codes</p>
        </div>
        <Button type="button" className="gap-1" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> New offer
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Code / Discount</th>
              <th className="px-4 py-3 text-left">Target</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left" />
            </tr>
          </thead>
          <tbody>
            {(data?.offers ?? []).map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{o.title}</td>
                <td className="px-4 py-3 capitalize">{o.type}</td>
                <td className="px-4 py-3">
                  {o.type === "coupon" ? (
                    <>
                      {o.code} · {o.discountType} {o.discountValue}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">{o.target}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3">{o.priority}</td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost" type="button" onClick={() => del.mutate(o.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Type</Label>
                <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  <option value="banner">Banner</option>
                  <option value="coupon">Coupon</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
            {form.type === "coupon" && (
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label>Code</Label>
                  <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
                </div>
                <div className="space-y-1">
                  <Label>Discount type</Label>
                  <select className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm" value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}>
                    <option value="percent">Percent</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Value</Label>
                  <Input value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))} />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Starts</Label>
                <Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Expires</Label>
                <Input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Banner image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" disabled={save.isPending || !form.title} onClick={() => save.mutate()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
