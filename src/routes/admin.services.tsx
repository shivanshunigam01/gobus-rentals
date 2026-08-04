import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { slugify } from "@/lib/slugify";
import type { ServicePage } from "@/lib/api/content";

export const Route = createFileRoute("/admin/services")({
  component: AdminServices,
});

const emptyForm = {
  title: "",
  slug: "",
  category: "service" as ServicePage["category"],
  shortDescription: "",
  description: "",
  benefits: "",
  whyChooseUs: "",
  faqs: "",
  vehicleTypeSlugs: "",
  citySlugs: "",
  keywords: "",
  metaTitle: "",
  metaDescription: "",
  status: "draft",
  featured: false,
  sortOrder: "100",
  ctaLabel: "Get a Free Quote",
  ctaHref: "/book",
};

function AdminServices() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"service" | "corporate" | "industry">("service");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<ServicePage | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => api<{ items: ServicePage[] }>("/api/admin/services"),
  });

  const items = useMemo(
    () => (data?.items || []).filter((i) => i.category === tab),
    [data, tab],
  );

  const reset = () => {
    setEdit(null);
    setForm({ ...emptyForm, category: tab });
  };

  const openEdit = (row: ServicePage) => {
    setEdit(row);
    setForm({
      title: row.title,
      slug: row.slug,
      category: row.category,
      shortDescription: row.shortDescription || "",
      description: row.description || "",
      benefits: (row.benefits || []).join("\n"),
      whyChooseUs: (row.whyChooseUs || []).join("\n"),
      faqs: (row.faqs || []).map((f) => `${f.question}|${f.answer}`).join("\n"),
      vehicleTypeSlugs: (row.vehicleTypeSlugs || []).join(", "),
      citySlugs: (row.citySlugs || []).join(", "),
      keywords: (row.keywords || []).join(", "),
      metaTitle: row.metaTitle || "",
      metaDescription: row.metaDescription || "",
      status: row.status || "draft",
      featured: !!row.featured,
      sortOrder: String(row.sortOrder ?? 100),
      ctaLabel: row.cta?.label || "Get a Free Quote",
      ctaHref: row.cta?.href || "/book",
    });
    setOpen(true);
  };

  const buildBody = () => ({
    title: form.title,
    slug: form.slug || slugify(form.title),
    category: form.category,
    shortDescription: form.shortDescription,
    description: form.description,
    benefits: form.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
    whyChooseUs: form.whyChooseUs.split("\n").map((s) => s.trim()).filter(Boolean),
    faqs: form.faqs
      .split("\n")
      .map((line) => {
        const [question, ...rest] = line.split("|");
        return { question: question?.trim(), answer: rest.join("|").trim() };
      })
      .filter((f) => f.question && f.answer),
    vehicleTypeSlugs: form.vehicleTypeSlugs.split(",").map((s) => s.trim()).filter(Boolean),
    citySlugs: form.citySlugs.split(",").map((s) => s.trim()).filter(Boolean),
    keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    status: form.status,
    featured: form.featured,
    sortOrder: Number(form.sortOrder) || 100,
    cta: { label: form.ctaLabel, href: form.ctaHref },
  });

  const saveMut = useMutation({
    mutationFn: () => {
      const body = buildBody();
      const id = edit?._id || edit?.id;
      if (id) return api(`/api/admin/services/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      return api("/api/admin/services", { method: "POST", body: JSON.stringify(body) });
    },
    onSuccess: () => {
      toast.success("Saved");
      setOpen(false);
      reset();
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/admin/services/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className={panelPage}>
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Services & Landings</h1>
          <p className="text-sm text-muted-foreground">Manage service, corporate, and industry pages</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> New page
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="service">Services</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
          <TabsTrigger value="industry">Industries</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4 space-y-2">
          {isLoading && <p className={panelStatePadding}>Loading…</p>}
          {items.map((row) => {
            const id = String(row._id || row.id);
            return (
              <div key={id} className="border rounded-lg p-3 bg-card flex justify-between gap-3">
                <div>
                  <p className="font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">
                    /{row.category === "industry" ? "industries" : row.category}/{row.slug} · {row.status}
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
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{edit ? "Edit page" : "New page"}</DialogTitle>
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v as ServicePage["category"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">service</SelectItem>
                    <SelectItem value="corporate">corporate</SelectItem>
                    <SelectItem value="industry">industry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Short description</Label>
              <Textarea
                value={form.shortDescription}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                rows={2}
              />
            </div>
            <div>
              <Label>Full description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div>
              <Label>Benefits (one per line)</Label>
              <Textarea value={form.benefits} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} rows={3} />
            </div>
            <div>
              <Label>Why choose us (one per line)</Label>
              <Textarea
                value={form.whyChooseUs}
                onChange={(e) => setForm((f) => ({ ...f, whyChooseUs: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label>FAQs (question|answer per line)</Label>
              <Textarea value={form.faqs} onChange={(e) => setForm((f) => ({ ...f, faqs: e.target.value }))} rows={4} />
            </div>
            <div>
              <Label>Vehicle type slugs (comma)</Label>
              <Input
                value={form.vehicleTypeSlugs}
                onChange={(e) => setForm((f) => ({ ...f, vehicleTypeSlugs: e.target.value }))}
              />
            </div>
            <div>
              <Label>City slugs (comma)</Label>
              <Input value={form.citySlugs} onChange={(e) => setForm((f) => ({ ...f, citySlugs: e.target.value }))} />
            </div>
            <div>
              <Label>Keywords (comma)</Label>
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
                    <SelectItem value="hidden">hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort order</Label>
                <Input value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured on homepage
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
