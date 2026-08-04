import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { slugify } from "@/lib/slugify";

export const Route = createFileRoute("/admin/vehicle-types")({
  component: AdminVehicleTypes,
});

type Row = {
  _id?: string;
  id?: string;
  slug: string;
  name: string;
  category: string;
  seatsMin?: number;
  seatsMax?: number;
  description?: string;
  featured?: boolean;
  sortOrder?: number;
  status?: string;
};

function AdminVehicleTypes() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Row | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "bus",
    seatsMin: "0",
    seatsMax: "0",
    description: "",
    featured: false,
    sortOrder: "100",
    status: "active",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-vehicle-types"],
    queryFn: () => api<{ items: Row[] }>("/api/admin/vehicle-types"),
  });

  const reset = () => {
    setForm({
      name: "",
      slug: "",
      category: "bus",
      seatsMin: "0",
      seatsMax: "0",
      description: "",
      featured: false,
      sortOrder: "100",
      status: "active",
    });
    setEdit(null);
  };

  const openEdit = (row: Row) => {
    setEdit(row);
    setForm({
      name: row.name,
      slug: row.slug,
      category: row.category || "bus",
      seatsMin: String(row.seatsMin ?? 0),
      seatsMax: String(row.seatsMax ?? 0),
      description: row.description || "",
      featured: !!row.featured,
      sortOrder: String(row.sortOrder ?? 100),
      status: row.status || "active",
    });
    setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const body = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        category: form.category,
        seatsMin: Number(form.seatsMin) || 0,
        seatsMax: Number(form.seatsMax) || 0,
        description: form.description,
        featured: form.featured,
        sortOrder: Number(form.sortOrder) || 100,
        status: form.status,
      };
      const id = edit?._id || edit?.id;
      if (id) {
        return api(`/api/admin/vehicle-types/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      }
      return api("/api/admin/vehicle-types", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success(edit ? "Updated" : "Created");
      setOpen(false);
      reset();
      qc.invalidateQueries({ queryKey: ["admin-vehicle-types"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/admin/vehicle-types/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-vehicle-types"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = data?.items || [];

  return (
    <div className={panelPage}>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Types</h1>
          <p className="text-muted-foreground text-sm">Canonical catalog for booking, fleet, and SEO</p>
        </div>
        <Button
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Add type
        </Button>
      </div>

      {isLoading && <p className={panelStatePadding}>Loading…</p>}
      {error && <p className="text-destructive">Failed to load</p>}

      <div className="space-y-2">
        {items.map((row) => {
          const id = String(row._id || row.id);
          return (
            <div key={id} className="flex items-center justify-between gap-3 border rounded-lg p-3 bg-card">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  {row.slug} · {row.category} · {row.status}
                  {row.featured ? " · featured" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMut.mutate(id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{edit ? "Edit vehicle type" : "New vehicle type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: edit ? f.slug : slugify(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["bus", "coach", "cab", "shuttle", "specialty"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Seats min</Label>
                <Input value={form.seatsMin} onChange={(e) => setForm((f) => ({ ...f, seatsMin: e.target.value }))} />
              </div>
              <div>
                <Label>Seats max</Label>
                <Input value={form.seatsMax} onChange={(e) => setForm((f) => ({ ...f, seatsMax: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Sort order</Label>
                <Input value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="hidden">hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending || !form.name}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
