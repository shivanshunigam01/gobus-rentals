import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { slugify } from "@/lib/slugify";

export const Route = createFileRoute("/admin/blog-categories")({
  component: AdminBlogCategories,
});

type Row = { _id?: string; id?: string; name: string; slug: string; description?: string; status?: string };

function AdminBlogCategories() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Row | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: () => api<{ items: Row[] }>("/api/admin/blog-categories"),
  });

  const saveMut = useMutation({
    mutationFn: () => {
      const body = { name, slug: slug || slugify(name), description, status: "active" };
      const id = edit?._id || edit?.id;
      if (id) return api(`/api/admin/blog-categories/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      return api("/api/admin/blog-categories", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      setEdit(null);
      setName("");
      setSlug("");
      setDescription("");
      qc.invalidateQueries({ queryKey: ["admin-blog-categories"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/admin/blog-categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-blog-categories"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className={panelPage}>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <Button
          className="gap-2"
          onClick={() => {
            setEdit(null);
            setName("");
            setSlug("");
            setDescription("");
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>
      {isLoading && <p className={panelStatePadding}>Loading…</p>}
      <div className="space-y-2">
        {(data?.items || []).map((row) => {
          const id = String(row._id || row.id);
          return (
            <div key={id} className="border rounded-lg p-3 flex justify-between bg-card">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEdit(row);
                    setName(row.name);
                    setSlug(row.slug);
                    setDescription(row.description || "");
                    setOpen(true);
                  }}
                >
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? "Edit category" : "New category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!edit) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => saveMut.mutate()} disabled={!name}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
