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
import type { BlogPost } from "@/lib/api/content";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

type Cat = { _id?: string; id?: string; name: string; slug: string };
type Tag = Cat;

function AdminBlogs() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    featured: false,
    scheduledAt: "",
    categoryIds: [] as string[],
    tagIds: [] as string[],
    keywords: "",
    metaTitle: "",
    metaDescription: "",
    authorName: "Kartar Travels Editorial",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => api<{ items: BlogPost[] }>("/api/admin/blogs"),
  });
  const catsQ = useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: () => api<{ items: Cat[] }>("/api/admin/blog-categories"),
  });
  const tagsQ = useQuery({
    queryKey: ["admin-blog-tags"],
    queryFn: () => api<{ items: Tag[] }>("/api/admin/blog-tags"),
  });

  const reset = () => {
    setEdit(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      featured: false,
      scheduledAt: "",
      categoryIds: [],
      tagIds: [],
      keywords: "",
      metaTitle: "",
      metaDescription: "",
      authorName: "Kartar Travels Editorial",
    });
  };

  const openEdit = (row: BlogPost) => {
    setEdit(row);
    setForm({
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt || "",
      content: row.content || "",
      status: row.status || "draft",
      featured: !!row.featured,
      scheduledAt: "",
      categoryIds: (row.categoryIds || []).map((c) => String(c._id || c)),
      tagIds: (row.tagIds || []).map((t) => String(t._id || t)),
      keywords: (row.keywords || []).join(", "),
      metaTitle: row.metaTitle || "",
      metaDescription: row.metaDescription || "",
      authorName: row.author?.name || "Kartar Travels Editorial",
    });
    setOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: () => {
      const body = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        status: form.status,
        featured: form.featured,
        scheduledAt: form.status === "scheduled" && form.scheduledAt ? form.scheduledAt : null,
        categoryIds: form.categoryIds,
        tagIds: form.tagIds,
        keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        author: { name: form.authorName },
      };
      const id = edit?._id || edit?.id;
      if (id) return api(`/api/admin/blogs/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      return api("/api/admin/blogs", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      reset();
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/admin/blogs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleId = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  return (
    <div className={panelPage}>
      <div className="flex justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Create, schedule, and publish articles</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> New post
        </Button>
      </div>
      {isLoading && <p className={panelStatePadding}>Loading…</p>}
      <div className="space-y-2">
        {(data?.items || []).map((row) => {
          const id = String(row._id || row.id);
          return (
            <div key={id} className="border rounded-lg p-3 bg-card flex justify-between gap-3">
              <div>
                <p className="font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">
                  /blog/{row.slug} · {row.status}
                  {row.featured ? " · featured" : ""} · {row.readTimeMinutes || 5} min
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{edit ? "Edit post" : "New post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
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
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={8} />
            </div>
            <div>
              <Label>Author</Label>
              <Input value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} />
            </div>
            <div>
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(catsQ.data?.items || []).map((c) => {
                  const id = String(c._id || c.id);
                  const on = form.categoryIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`text-xs px-2 py-1 rounded border ${on ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, categoryIds: toggleId(f.categoryIds, id) }))}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(tagsQ.data?.items || []).map((t) => {
                  const id = String(t._id || t.id);
                  const on = form.tagIds.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`text-xs px-2 py-1 rounded border ${on ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, tagIds: toggleId(f.tagIds, id) }))}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="published">published</SelectItem>
                    <SelectItem value="scheduled">scheduled</SelectItem>
                    <SelectItem value="hidden">hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.status === "scheduled" && (
                <div>
                  <Label>Schedule at</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Keywords</Label>
              <Input value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
            </div>
            <div>
              <Label>Meta title</Label>
              <Input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} />
            </div>
            <div>
              <Label>Meta description</Label>
              <Textarea
                value={form.metaDescription}
                onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
                rows={2}
              />
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
            <Button onClick={() => saveMut.mutate()} disabled={!form.title}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
