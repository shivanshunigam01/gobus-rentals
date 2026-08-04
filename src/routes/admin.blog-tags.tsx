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

export const Route = createFileRoute("/admin/blog-tags")({
  component: AdminBlogTags,
});

type Row = { _id?: string; id?: string; name: string; slug: string; description?: string; status?: string };

function AdminBlogTags() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Row | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog-tags"],
    queryFn: () => api<{ items: Row[] }>("/api/admin/blog-tags"),
  });

  const saveMut = useMutation({
    mutationFn: () => {
      const body = { name, slug: slug || slugify(name), status: "active" };
      const id = edit?._id || edit?.id;
      if (id) return api(`/api/admin/blog-tags/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      return api("/api/admin/blog-tags", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      setEdit(null);
      setName("");
      setSlug("");
      qc.invalidateQueries({ queryKey: ["admin-blog-tags"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/admin/blog-tags/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-blog-tags"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className={panelPage}>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Tags</h1>
        <Button
          className="gap-2"
          onClick={() => {
            setEdit(null);
            setName("");
            setSlug("");
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
            <DialogTitle>{edit ? "Edit tag" : "New tag"}</DialogTitle>
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
